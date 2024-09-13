using IndicaMais.DbContexts;
using IndicaMais.Models;
using IndicaMais.Services.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace IndicaMais.Services
{
    public class ProcessoService : IProcessoService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Usuario> _userManager;
        private readonly SignInManager<Usuario> _signInManager;

        public ProcessoService(ApplicationDbContext context, UserManager<Usuario> userManager, SignInManager<Usuario> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<ProcessoMax> Buscar(int id)
        {
            var processo = await _context.Processos
                .Select(p => new ProcessoMax
                {
                    Id = p.Id,
                    Numero = p.Numero,
                    Nome = p.Nome,
                    Descricao = p.Descricao,
                    PendenteAndamento = p.PendenteAndamento,
                    NomeParceiro = p.Parceiro.Nome,
                    CpfParceiro = p.Parceiro.Cpf
                })
                .FirstOrDefaultAsync(p => p.Id == id);

            return processo;
        }

        public async Task<bool> Criar(CriarProcessoRequest request, int idParceiro)
        {
            var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.Id == idParceiro);

            if (parceiro != null)
            {
                var processo = new Processo
                {
                    Numero = request.Numero,
                    Nome = request.Nome,
                    Descricao = request.Descricao,
                    Parceiro = parceiro
                };

                await _context.Processos.AddAsync(processo);
                await _context.SaveChangesAsync();

                return true;
            }

            return false;
        }

        public async Task<(IEnumerable<ProcessoMin>? processos, bool temMais)> Listar(int pagina, int tamanho)
        {
            var user = await _userManager.GetUserAsync(_signInManager.Context.User);

            if (user != null)
            {
                var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.User.Id == user.Id);

                if (parceiro != null)
                {
                    int total = await _context.Processos.CountAsync(p => p.Parceiro.Id == parceiro.Id);

                    var processos = await _context.Processos
                        .Where(p => p.Parceiro.Id == parceiro.Id)
                        .Skip((pagina - 1) * tamanho)
                        .Take(tamanho)
                        .Select(p => new ProcessoMin
                        {
                            Id = p.Id,
                            Numero = p.Numero,
                            Nome = p.Nome,
                            Descricao = p.Descricao,
                            PendenteAndamento = p.PendenteAndamento
                        })
                        .ToListAsync();

                    bool temMais = pagina * tamanho < total;

                    return (processos, temMais);
                }
            }

            return (null, false);
        }

        public async Task<(IEnumerable<ProcessoMax> processos, bool temMais)> Listar(int pagina, int tamanho, string? nomeParceiro, string? cpf, string? nomeProcesso, string? numeroProcesso, bool? pendenteAndamento)
        {
            var query = _context.Processos.AsQueryable();

            if (!string.IsNullOrEmpty(nomeParceiro))
            {
                query = query.Where(p => p.Parceiro.Nome.StartsWith(nomeParceiro.ToUpper()));
            }

            if (!string.IsNullOrEmpty(cpf))
            {
                query = query.Where(p => p.Parceiro.Cpf == cpf);
            }

            if (!string.IsNullOrEmpty(nomeProcesso))
            {
                query = query.Where(p => p.Nome == nomeProcesso);
            }

            if (!string.IsNullOrEmpty(numeroProcesso))
            {
                query = query.Where(p => p.Numero == numeroProcesso);
            }

            if (pendenteAndamento.HasValue)
            {
                query = query.Where(p => p.PendenteAndamento == pendenteAndamento);
            }

            int total = await query.CountAsync();

            var processos = await query
                .Skip((pagina - 1) * tamanho)
                .Take(tamanho)
                .Select(p => new ProcessoMax
                {
                    Id = p.Id,
                    Numero = p.Numero,
                    Nome = p.Nome,
                    Descricao = p.Descricao,
                    PendenteAndamento = p.PendenteAndamento,
                    NomeParceiro = p.Parceiro.Nome,
                    CpfParceiro = p.Parceiro.Cpf
                })
                .ToListAsync();

            bool temMais = (pagina * tamanho) < total;

            return (processos, temMais);
        }

        public async Task<bool> Editar(EditarProcessoRequest request, int id)
        {
            var processo = await _context.Processos.FirstOrDefaultAsync(p => p.Id == id);

            if (processo != null)
            {
                if (!request.Numero.IsNullOrEmpty())
                {
                    processo.Numero = request.Numero;
                }

                if (!request.Nome.IsNullOrEmpty())
                {
                    processo.Nome = request.Nome;
                }

                if (!request.Descricao.IsNullOrEmpty())
                {
                    processo.Descricao = request.Descricao;
                }

                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> Excluir(int id)
        {
            var processo = await _context.Processos.FirstOrDefaultAsync(p => p.Id == id);

            if (processo != null)
            {
                var andamentos = await _context.Andamentos
                    .Where(a => a.Processo == processo)
                    .ToListAsync();

                _context.Andamentos.RemoveRange(andamentos);
                _context.Processos.Remove(processo);
                await _context.SaveChangesAsync();

                return true;
            }

            return false;
        }

        public async Task<bool> CriarAndamento(CriarAndamentoRequest request, int id)
        {
            var processo = await _context.Processos.FirstOrDefaultAsync(p => p.Id == id);

            if (processo != null)
            {
                var andamento = new Andamento
                {
                    Descricao = request.Descricao,
                    Processo = processo
                };

                if (processo.PendenteAndamento == true)
                {
                    processo.PendenteAndamento = false;
                }

                await _context.Andamentos.AddAsync(andamento);
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> PedirAndamento(int id)
        {
            var processo = await _context.Processos.FirstOrDefaultAsync(p => p.Id == id);

            if (processo != null)
            {
                if (processo.PendenteAndamento == false)
                {
                    processo.PendenteAndamento = true;
                    await _context.SaveChangesAsync();
                    return true;
                }
            }

            return false;
        }

        public async Task<(IEnumerable<AndamentoMin>? andamentos, bool temMais)> ListarAndamentos(int id, int pagina, int tamanho)
        {
            var query = _context.Processos.AsQueryable();
            var user = await _userManager.GetUserAsync(_signInManager.Context.User);

            if (user != null)
            {
                if (user.IsStaff)
                {
                    var cargos = await _userManager.GetRolesAsync(user);

                    if (cargos.Contains("Admin") || cargos.Contains("Gestor"))
                    {
                        query = query.Where(p => p.Id == id);
                    }
                }
                else
                {
                    var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.User.Id == user.Id);

                    if (parceiro != null)
                    {
                        query = query.Where(p => p.Id == id && p.Parceiro == parceiro);
                    }
                }

                var processo = await query.FirstOrDefaultAsync();

                if (processo != null)
                {
                    int total = await _context.Andamentos.CountAsync(a => a.Processo == processo);

                    var andamentos = await _context.Andamentos
                        .Where(a => a.Processo == processo)
                        .OrderByDescending(a => a.Data)
                        .Skip((pagina - 1) * tamanho)
                        .Take(tamanho)
                        .Select(a => new AndamentoMin
                        {
                            Id = a.Id,
                            Descricao = a.Descricao,
                            Data = a.Data
                        })
                        .ToListAsync();

                    bool temMais = pagina * tamanho < total;

                    return (andamentos, temMais);
                }
            }

            return (null, false);
        }

        public async Task<bool> EditarAndamento(EditarAndamentoRequest request, int id)
        {
            var andamento = await _context.Andamentos.FirstOrDefaultAsync(a => a.Id == id);

            if (andamento != null)
            {
                _context.Andamentos.Remove(andamento);
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> ExcluirAndamento(int id)
        {
            var andamento = await _context.Andamentos.FirstOrDefaultAsync(a => a.Id == id);

            if (andamento != null)
            {
                _context.Andamentos.Remove(andamento);
                await _context.SaveChangesAsync();
                return true;
            }
            
            return false;
        }
    }
}
