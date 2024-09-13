using IndicaMais.DbContexts;
using IndicaMais.Models;
using IndicaMais.Services.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text;

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

        public async Task<(IEnumerable<TransacaoParceiroMin>? transacoes, bool temMais)> Listar(int pagina, int tamanho)
        {
            var user = await _userManager.GetUserAsync(_signInManager.Context.User);

            if (user != null)
            {
                var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.User.Id == user.Id);

                if (parceiro != null)
                {
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
            }

            return (null, false);
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

        public async Task<int> ContarTodasTransacoes(bool premio, DateTime? dataInicial, DateTime? dataFinal)
        {
            var query = _context.Transacoes.AsQueryable();

            if (premio)
            {
                query = query.Where(t => t.Premio != null);
            }

            if (dataFinal.HasValue)
            {
                dataFinal = dataFinal.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            }

            if (dataInicial.HasValue && dataFinal.HasValue)
            {
                if (premio)
                {
                    query = query.Where(t => t.Data >= dataInicial && t.Data <= dataFinal);
                }
                else
                {
                    query = query.Where(t => t.Data >= dataInicial && t.Data <= dataFinal);
                }
            }
            else if (dataInicial.HasValue)
            {
                if (premio)
                {
                    query = query.Where(t => t.Data >= dataInicial);
                }
                else
                {
                    query = query.Where(t => t.Data >= dataInicial);
                }
            }
            else if (dataFinal.HasValue)
            {
                if (premio)
                {
                    query = query.Where(t => t.Data <= dataFinal);
                }
                else
                {
                    query = query.Where(t => t.Data <= dataFinal);
                }
            }

            int totalInd = await query.CountAsync();

            return totalInd;
        }

        public async Task<byte[]?> GerarRelatorio(GerarRelatorioTransacoesRequest request)
        {
            var query = _context.Transacoes.AsQueryable();

            if (!string.IsNullOrEmpty(request.Nome))
            {
                query = query.Where(t => t.Parceiro.Nome.StartsWith(request.Nome.ToUpper()));
            }

            if (request.Tipo.HasValue)
            {
                query = query.Where(t => t.Tipo == request.Tipo.Value);
            }

            if (request.Baixa.HasValue)
            {
                query = query.Where(t => t.Baixa == request.Baixa.Value);
            }

            if (request.Premio.HasValue)
            {
                query = query.Where(t => t.Premio.Id == request.Premio);
            }

            if (request.DataFinal.HasValue)
            {
                request.DataFinal = request.DataFinal.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            }

            if (request.DataInicial.HasValue && request.DataFinal.HasValue)
            {
                query = query.Where(t => t.Data >= request.DataInicial && t.Data <= request.DataFinal);
            }
            else if (request.DataInicial.HasValue)
            {
                query = query.Where(t => t.Data >= request.DataInicial);
            }
            else if (request.DataFinal.HasValue)
            {
                query = query.Where(t => t.Data <= request.DataFinal);
            }

            var transacoes = await query
                .Include(t => t.Parceiro)
                .Include(t => t.Premio)
                .ToListAsync();

            var csv = new StringBuilder();
            csv.AppendLine("Id,Nome do Parceiro,Valor,Tipo,Situação,Data,Prêmio Resgatado");

            foreach (var transacao in transacoes)
            { 
                csv.AppendLine($"{transacao.Id},{transacao.Parceiro.Nome},{transacao.Valor}," +
                    $"{(transacao.Tipo == 0 ? "Resgate" : transacao.Tipo == 1 ? "Abate" : "Prêmio")}," +
                    $"{(transacao.Baixa ? "Baixado" : "Em aberto")}," +
                    $"{transacao.Data:yyyy-MM-dd},{transacao.Premio?.Nome ?? "N/A"}");
            }

            var bom = new byte[] { 0xEF, 0xBB, 0xBF };
            var csvBytes = Encoding.UTF8.GetBytes(csv.ToString());
            var result = bom.Concat(csvBytes).ToArray();

            return result;
        }
    }
}
