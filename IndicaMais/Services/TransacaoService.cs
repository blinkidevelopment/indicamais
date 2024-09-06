using IndicaMais.DbContexts;
using IndicaMais.Models;
using IndicaMais.Services.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace IndicaMais.Services
{
    public class TransacaoService : ITransacaoService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Usuario> _userManager;
        private readonly SignInManager<Usuario> _signInManager;

        public TransacaoService(ApplicationDbContext context, UserManager<Usuario> userManager, SignInManager<Usuario> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<bool> Criar(CriarTransacaoRequest request)
        {
            var user = await _userManager.GetUserAsync(_signInManager.Context.User);
            var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.User.Id == user.Id);

            if (parceiro.Credito >= request.Valor)
            {
                var resgate = new Transacao
                {
                    Parceiro = parceiro,
                    Valor = request.Valor,
                    Tipo = 1
                };

                _context.Transacoes.Add(resgate);
                parceiro.Credito -= request.Valor;

                await _context.SaveChangesAsync();

                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<(IEnumerable<TransacaoParceiroMin> transacoes, bool temMais)> Listar(int pagina, int tamanho)
        {
            var user = await _userManager.GetUserAsync(_signInManager.Context.User);
            var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.User.Id == user.Id);

            int total = await _context.Transacoes.CountAsync(t => t.Parceiro.Id == parceiro.Id);

            var transacoes = await _context.Transacoes
                .Where(t => t.Parceiro.Id == parceiro.Id)
                .Skip((pagina - 1) * tamanho)
                .Take(tamanho)
                .Select(t => new TransacaoParceiroMin
                {
                    Data = t.Data,
                    Valor = t.Valor,
                    Tipo = t.Tipo,
                    NomePremio = _context.Premios
                        .Where(p => p.Id == t.Premio.Id)
                        .Select(p => p.Nome)
                        .FirstOrDefault()
                })
                .ToListAsync();

            bool temMais = (pagina * tamanho) < total;

            return (transacoes, temMais);
        }

        public async Task<(IEnumerable<TransacaoMin> transacoes, bool temMais)> Listar(int id, int pagina, int tamanho)
        {
            int total = await _context.Transacoes.CountAsync(t => t.Parceiro.Id == id);

            var transacoes = await _context.Transacoes
                .Where(t => t.Parceiro.Id == id)
                .Skip((pagina - 1) * tamanho)
                .Take(tamanho)
                .Select(t => new TransacaoMin
                {
                    Id = t.Id,
                    Data = t.Data,
                    NomeParceiro = _context.Parceiros
                        .Where(p => p.Id == t.Parceiro.Id)
                        .Select(p => p.Nome)
                        .FirstOrDefault()!,
                    Valor = t.Valor,
                    Tipo = t.Tipo,
                    NomePremio = _context.Premios
                        .Where(p => p.Id == t.Premio.Id)
                        .Select(p => p.Nome)
                        .FirstOrDefault(),
                    Baixa = t.Baixa
                })
                .ToListAsync();

            bool temMais = (pagina * tamanho) < total;

            return (transacoes, temMais);
        }

        public async Task<(IEnumerable<TransacaoMin> transacoes, bool temMais)> Listar(int pagina, int tamanho, int? tipo, bool? baixa, string? nome, string? cpf)
        {
            var query = _context.Transacoes.AsQueryable();

            if (tipo.HasValue)
            {
                query = query.Where(t => t.Tipo == tipo.Value);
            }

            if (baixa.HasValue)
            {
                query = query.Where(t => t.Baixa == baixa.Value);
            }

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(t => t.Parceiro.Nome.StartsWith(nome.ToUpper()));
            }

            if (!string.IsNullOrEmpty(cpf))
            {
                query = query.Where(t => t.Parceiro.Cpf == cpf);
            }

            int total = await query.CountAsync();

            var transacoes = await query
                .Skip((pagina - 1) * tamanho)
                .Take(tamanho)
                .Select(t => new TransacaoMin
                {
                    Id = t.Id,
                    Data = t.Data,
                    NomeParceiro = _context.Parceiros
                        .Where(p => p.Id == t.Parceiro.Id)
                        .Select(p => p.Nome)
                        .FirstOrDefault()!,
                    Valor = t.Valor,
                    Tipo = t.Tipo,
                    NomePremio = _context.Premios
                        .Where(p => p.Id == t.Premio.Id)
                        .Select(p => p.Nome)
                        .FirstOrDefault(),
                    Baixa = t.Baixa
                })
                .ToListAsync();

            bool temMais = (pagina * tamanho) < total;

            return (transacoes, temMais);
        }

        public async Task<bool> MudarStatus(int id)
        {
            var transacao = await _context.Transacoes.FirstOrDefaultAsync(t => t.Id == id);

            if (transacao != null)
            {
                transacao.Baixa = true;
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
