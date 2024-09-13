using IndicaMais.DbContexts;
using IndicaMais.Models;
using IndicaMais.Services.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace IndicaMais.Services
{
    public class PremioService : IPremioService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Usuario> _userManager;
        private readonly SignInManager<Usuario> _signInManager;

        public PremioService(ApplicationDbContext context, UserManager<Usuario> userManager, SignInManager<Usuario> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<bool> Criar(CriarPremioRequest request)
        {
            try
            {
                var premio = new Premio
                {
                    Nome = request.Nome,
                    Valor = request.Valor,
                    Disponivel = request.Disponivel,
                    Descricao = request.Descricao,
                    Imagem = request.Imagem
                };

                await _context.Premios.AddAsync(premio);
                await _context.SaveChangesAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<IEnumerable<Premio>> Listar()
        {
            var result = await _context.Premios.ToListAsync();
            return result;
        }

        public async Task<IEnumerable<Premio>> ListarPremiosDisponiveis()
        {
            var result = await _context.Premios.Where(p => p.Disponivel == true).ToListAsync();
            return result;
        }

        public async Task<bool> Resgatar(int id)
        {
            try
            {
                var premio = await _context.Premios.FirstOrDefaultAsync(p => p.Id == id);
                var user = await _userManager.GetUserAsync(_signInManager.Context.User);
                var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.User.Id == user.Id);

                if (parceiro.Credito >= premio.Valor)
                {
                    var resgate = new Transacao
                    {
                        Parceiro = parceiro,
                        Valor = premio.Valor,
                        Premio = premio
                    };

                    _context.Transacoes.Add(resgate);
                    parceiro.Credito -= premio.Valor;

                    await _context.SaveChangesAsync();

                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> Editar(EditarPremioRequest request, int id)
        {
            var premio = _context.Premios.FirstOrDefault(p => p.Id == id);

            if (premio != null)
            {
                if (!request.Nome.IsNullOrEmpty())
                {
                    premio.Nome = request.Nome;
                }

                if (request.Valor.HasValue)
                {
                    premio.Valor = request.Valor.Value;
                }

                if (request.Disponivel.HasValue)
                {
                    premio.Disponivel = request.Disponivel.Value;
                }

                if (!request.Descricao.IsNullOrEmpty())
                {
                    premio.Descricao = request.Descricao;
                }

                if (!request.Imagem.IsNullOrEmpty())
                {
                    premio.Imagem = request.Imagem;
                }

                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> Excluir(int id)
        {
            var premio = await _context.Premios.FirstOrDefaultAsync(p => p.Id == id);

            if (premio != null)
            {
                var transacoes = await _context.Transacoes.Where(t => t.Premio == premio).ToListAsync();

                if (transacoes.Count >= 1)
                {
                    return false;
                }
                else
                {
                    _context.Premios.Remove(premio);
                    await _context.SaveChangesAsync();
                    return true;
                }
            }

            return false;
        }
    }
}
