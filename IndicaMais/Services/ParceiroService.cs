using IndicaMais.DbContexts;
using IndicaMais.Models;
using IndicaMais.Services.DTOs;
using IndicaMais.Services.Integrations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace IndicaMais.Services
{
    public class ParceiroService : IParceiroService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Usuario> _userManager;
        private readonly SignInManager<Usuario> _signInManager;
        private readonly ICurrentTenantService _currentTenantService;
        private readonly AsaasService _asaas;
        private readonly ViosService _vios;
        public string CurrentTenantId { get; set; }

        public ParceiroService(ApplicationDbContext context, UserManager<Usuario> userManager, SignInManager<Usuario> signInManager, ICurrentTenantService currentTenantService, AsaasService asaas, ViosService vios)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _currentTenantService = currentTenantService;
            CurrentTenantId = _currentTenantService.TenantId;
            _asaas = asaas;
            _vios = vios;
        }

        public async Task<bool> Criar(CriarParceiroRequest request)
        {
            if (request.Senha == request.Confirmacao && request.Senha.Length >= 6 && request.Cpf.Length == 11 && request.Telefone.Length == 11)
            {
                var user = new Usuario
                {
                    UserName = $"user_{CurrentTenantId}_{request.Cpf}"
                };

                var result = await _userManager.CreateAsync(user, request.Senha);

                if (result.Succeeded)
                {
                    try
                    {
                        var parceiro = new Parceiro
                        {
                            Nome = request.Nome,
                            Telefone = request.Telefone,
                            Cpf = request.Cpf,
                            User = user
                        };

                        _context.Parceiros.Add(parceiro);
                        await _context.SaveChangesAsync();
                        return true;
                    }
                    catch
                    {
                        await _userManager.DeleteAsync(user);
                    }
                }
            }

            return false;
        }

        public async Task<bool> Criar(CriarParceiroInternamenteRequest request)
        {
            if (request.Senha == request.Confirmacao && request.Senha.Length >= 6 && request.Cpf.Length == 11 && request.Telefone.Length == 11)
            {
                var user = new Usuario
                {
                    UserName = $"user_{CurrentTenantId}_{request.Cpf}"
                };

                var result = await _userManager.CreateAsync(user, request.Senha);

                if (result.Succeeded)
                {
                    try
                    {
                        var parceiro = new Parceiro
                        {
                            Nome = request.Nome,
                            Telefone = request.Telefone,
                            Cpf = request.Cpf,
                            Tipo = request.Tipo,
                            User = user
                        };

                        _context.Parceiros.Add(parceiro);
                        await _context.SaveChangesAsync();
                        return true;
                    }
                    catch
                    {
                        await _userManager.DeleteAsync(user);
                    }
                }
            }

            return false;
        }

        public async Task<Parceiro> Buscar(string cpf)
        {
            return await _context.Parceiros.FirstOrDefaultAsync(p => p.Cpf == cpf);
        }

        public async Task<ParceiroMin> Buscar(int id)
        {
            var parceiro = await _context.Parceiros
                .Where(p => p.Id == id)
                .Select(p => new ParceiroMin 
                {
                    Nome = p.Nome,
                    Cpf = p.Cpf,
                    Telefone = p.Telefone,
                    Credito = p.Credito,
                    Tipo = p.Tipo,
                    IndicadoPor = _context.Indicacoes
                        .Where(i => i.Indicado.Id == p.Id)
                        .Select(i => i.Parceiro.Nome)
                        .FirstOrDefault(),
                    Fechou = p.Fechou
                })
                .FirstOrDefaultAsync();

            return parceiro;
        }

        public async Task<IEnumerable<ParceiroSimp>> BuscarNome(string nome)
        {
            var parceiro = await _context.Parceiros
                .Where(p => p.Nome.StartsWith(nome.ToUpper()))
                .Select(p => new ParceiroSimp
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Cpf = p.Cpf
                })
                .ToListAsync();

            return parceiro;
        }

        public async Task<string> BuscarNomeCodigo(string codigoIndicacao)
        {
            var nome = await _context.Parceiros
                .Where(p => p.CodigoIndicacao.ToString() == codigoIndicacao)
                .Select(p => p.Nome)
                .FirstOrDefaultAsync();

            return nome;
        }

        public async Task<Parceiro> Buscar()
        {
            var user = await _userManager.GetUserAsync(_signInManager.Context.User);
            return await _context.Parceiros.FirstOrDefaultAsync(p => p.User.Id == user.Id);
        }

        public async Task<(IEnumerable<Parceiro> parceiros, bool temMais)> Listar(int pagina, int tamanho, string? nome, string? cpf, int? tipo, bool? fechou, bool? indicado)
        {
            var query = _context.Parceiros.AsQueryable();

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(p => p.Nome.StartsWith(nome.ToUpper()));
            }

            if (!string.IsNullOrEmpty(cpf))
            {
                query = query.Where(p => p.Cpf == cpf);
            }

            if (tipo.HasValue)
            {
                query = query.Where(p => p.Tipo == tipo.Value);
            }

            if (fechou.HasValue)
            {
                query = query.Where(p => p.Fechou == fechou.Value);
            }

            if (indicado.HasValue)
            {
                if (indicado.Value)
                {
                    query = query.Where(p => _context.Indicacoes.Any(i => i.Indicado.Id == p.Id));
                }
                else
                {
                    query = query.Where(p => !_context.Indicacoes.Any(i => i.Indicado.Id == p.Id));
                }
            }

            int total = await query.CountAsync();

            var parceiros = await query
                .Skip((pagina - 1) * tamanho)
                .Take(tamanho)
                .ToListAsync();

            bool temMais = (pagina * tamanho) < total;

            return (parceiros, temMais);
        }

        public async Task<(bool statusCRM, bool status)> ChecarExistencia(string cpf)
        {
            bool statusCRM = await _vios.VerificarCadastro(cpf);
            bool status = await _context.Parceiros.AnyAsync(p => p.Cpf == cpf);
            return (statusCRM, status);
        }

        public async Task<bool?> ChecarExistenciaIndicado(string telefone)
        {
            var parceiro = await _context.Parceiros.Where(p => p.Telefone == telefone).FirstOrDefaultAsync();

            if (parceiro != null)
            {
                return parceiro.Cpf.IsNullOrEmpty();
            }
            else
            {
                return null;
            }
        }

        public async Task<bool> Editar(EditarParceiroRequest request)
        {
            var user = await _userManager.GetUserAsync(_signInManager.Context.User);
            var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.User.Id == user.Id);
            var result = true;

            if (!request.Nome.IsNullOrEmpty())
            {
                parceiro.Nome = request.Nome;
            }

            if (!request.Telefone.IsNullOrEmpty())
            {
                var statusTelefone = await _context.Parceiros.FirstOrDefaultAsync(p => p.Telefone == request.Telefone);

                if (statusTelefone == null)
                {
                    parceiro.Telefone = request.Telefone;
                }
                else
                {
                    result = false;
                }
            }

            if (!request.Senha.IsNullOrEmpty())
            {
                await _userManager.RemovePasswordAsync(user);
                await _userManager.AddPasswordAsync(user, request.Senha);
            }

            await _context.SaveChangesAsync();
            return result;
        }

        public async Task<bool> AtualizarIndicado(AtualizarIndicadoRequest request, string telefone)
        {
            if (request.Senha == request.Confirmacao && request.Senha.Length >= 6 && request.Cpf.Length == 11)
            {
                var parceiro = await _context.Parceiros.Include(p => p.User).FirstOrDefaultAsync(p => p.Telefone == telefone);

                if (parceiro.Cpf.IsNullOrEmpty() && parceiro.User == null)
                {
                    var user = new Usuario
                    {
                        UserName = $"user_{CurrentTenantId}_{request.Cpf}"
                    };

                    var result = await _userManager.CreateAsync(user, request.Senha);

                    if (result.Succeeded)
                    {
                        parceiro.Cpf = request.Cpf;
                        parceiro.User = user;
                        await _context.SaveChangesAsync();
                        return true;
                    }
                }
            }

            return false;
        }

        public async Task<bool> CriarIndicacao(CriarIndicacaoRequest request)
        {
            try
            {
                var indicado = new Parceiro
                {
                    Nome = request.Nome,
                    Telefone = request.Telefone
                };

                _context.Parceiros.Add(indicado);
                await _context.SaveChangesAsync();

                var user = await _userManager.GetUserAsync(_signInManager.Context.User);
                var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.User.Id == user.Id);

                var indicacao = new Models.Indicacao
                {
                    Parceiro = parceiro,
                    Indicado = indicado
                };

                _context.Indicacoes.Add(indicacao);
                await _context.SaveChangesAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> CriarIndicacao(CriarIndicacaoRequest request, string codigoIndicacao)
        {
            try
            {
                var indicado = new Parceiro
                {
                    Nome = request.Nome,
                    Telefone = request.Telefone
                };

                _context.Parceiros.Add(indicado);
                await _context.SaveChangesAsync();

                var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.CodigoIndicacao.ToString() == codigoIndicacao);

                var indicacao = new Models.Indicacao
                {
                    Parceiro = parceiro,
                    Indicado = indicado
                };

                _context.Indicacoes.Add(indicacao);
                await _context.SaveChangesAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<(IEnumerable<IndicadoMin> indicacoes, bool temMais)> ListarIndicacoes(int pagina, int tamanho)
        {
            var user = await _userManager.GetUserAsync(_signInManager.Context.User);
            var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.User.Id == user.Id);

            int total = await _context.Indicacoes.CountAsync(i => i.Parceiro.Id == parceiro.Id);

            var indicacoes = await _context.Indicacoes
                .Where(i => i.Parceiro.Id == parceiro.Id)
                .Select(i => new IndicadoMin
                {
                    Nome = i.Indicado.Nome,
                    Telefone = i.Indicado.Telefone,
                    Fechou = i.Indicado.Fechou
                })
                .Skip((pagina - 1) * tamanho)
                .Take(tamanho)
                .ToListAsync();

            bool temMais = (pagina * tamanho) < total;

            return (indicacoes, temMais);
        }

        public async Task<(IEnumerable<Indicado> indicacoes, bool temMais)> ListarIndicacoes(int id, int pagina, int tamanho)
        {
            var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.Id == id);

            int total = await _context.Indicacoes.CountAsync(i => i.Parceiro.Id == parceiro.Id);

            var indicacoes = await _context.Indicacoes
                .Where(i => i.Parceiro.Id == parceiro.Id)
                .Select(i => new Indicado
                {
                    Id = i.Indicado.Id,
                    Nome = i.Indicado.Nome,
                    Cpf = i.Indicado.Cpf,
                    Telefone = i.Indicado.Telefone,
                    Fechou = i.Indicado.Fechou,
                    Repassado = i.Indicado.Repassado
                })
                .Skip((pagina - 1) * tamanho)
                .Take(tamanho)
                .ToListAsync();

            bool temMais = (pagina * tamanho) < total;

            return (indicacoes, temMais);
        }

        public async Task<RespostaAPI> ListarCobrancas(int pagina)
        {
            var user = await _userManager.GetUserAsync(_signInManager.Context.User);
            var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.User.Id == user.Id);
            var idAsaas = await _asaas.BuscarId(parceiro.Cpf);
            var result = await _asaas.ListarCobrancas(idAsaas, pagina);
            return result;
        }

        public async Task<int> ContarIndicacoes(bool fechadas)
        {
            var user = await _userManager.GetUserAsync(_signInManager.Context.User);
            var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.User.Id == user.Id);

            if (parceiro != null)
            {
                var query = _context.Indicacoes.Where(i => i.Parceiro.Id == parceiro.Id);

                if (fechadas)
                {
                    query = query.Where(i => i.Indicado.Fechou == true);
                }

                int totalInd = await query.CountAsync();

                return totalInd;
            }

            return 0;
        }

        public async Task<int> ContarIndicacoes(int id, bool fechadas)
        {
            var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.Id == id);

            if (parceiro != null)
            {
                var query = _context.Indicacoes.Where(i => i.Parceiro.Id == parceiro.Id);

                if (fechadas)
                {
                    query = query.Where(i => i.Indicado.Fechou == true);
                }

                int totalInd = await query.CountAsync();

                return totalInd;
            }

            return 0;
        }

        public async Task<int> ContarTodasIndicacoes(bool fechadas, DateTime? dataInicial, DateTime? dataFinal)
        {
            var query = _context.Indicacoes.AsQueryable();

            if (fechadas)
            {
                query = query.Where(i => i.Indicado.Fechou == true);
            }

            if (dataFinal.HasValue)
            {
                dataFinal = dataFinal.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            }

            if (dataInicial.HasValue && dataFinal.HasValue)
            {
                if (fechadas)
                {
                    query = query.Where(i => i.Indicado.FechouEm >= dataInicial && i.Indicado.FechouEm <= dataFinal);
                }
                else
                {
                    query = query.Where(i => i.Indicado.CriadoEm >= dataInicial && i.Indicado.CriadoEm <= dataFinal);
                }
            }
            else if (dataInicial.HasValue)
            {
                if (fechadas)
                {
                    query = query.Where(i => i.Indicado.FechouEm >= dataInicial);
                }
                else
                {
                    query = query.Where(i => i.Indicado.CriadoEm >= dataInicial);
                }
            }
            else if (dataFinal.HasValue)
            {
                if (fechadas)
                {
                    query = query.Where(i => i.Indicado.FechouEm <= dataFinal);
                }
                else
                {
                    query = query.Where(i => i.Indicado.CriadoEm <= dataFinal);
                }
            }

            int totalInd = await query.CountAsync();

            return totalInd;
        }

        public async Task<bool> AlterarSenha(AlterarSenhaRequest request, int id)
        {
            if (request.Senha == request.Confirmacao)
            {
                var parceiro = await _context.Parceiros.Include(p => p.User).FirstOrDefaultAsync(p => p.Id == id);

                if (parceiro != null)
                {
                    if (parceiro.User != null)
                    {
                        await _userManager.RemovePasswordAsync(parceiro.User);
                        await _userManager.AddPasswordAsync(parceiro.User, request.Senha);
                        return true;
                    }
                }
            }

            return false;
        }

        public async Task<bool> AlterarStatus(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.Id == id);

                if (parceiro != null)
                {
                    if(parceiro.Fechou == false)
                    {
                        var valorInd = await _context.Configuracoes
                            .Where(c => c.Chave == "valorInd")
                            .Select(c => c.Valor)
                            .FirstOrDefaultAsync();

                        parceiro.Fechou = true;
                        parceiro.FechouEm = DateTime.UtcNow;
                        _context.Parceiros.Update(parceiro);

                        var indicador = await _context.Indicacoes
                            .Where(i => i.Indicado.Id == parceiro.Id)
                            .Select(i => i.Parceiro)
                            .FirstOrDefaultAsync();

                        if (indicador != null)
                        {
                            indicador.Credito = indicador.Credito + valorInd;
                            _context.Parceiros.Update(indicador);
                        }
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                return false;
            }
        }

        public async Task<bool> AlterarStatusRepasse(int id)
        {
            var parceiro = await _context.Parceiros.FirstOrDefaultAsync(i => i.Id == id);

            if (parceiro != null)
            {
                parceiro.Repassado = !parceiro.Repassado;
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> Excluir()
        {
            var user = await _userManager.GetUserAsync(_signInManager.Context.User);

            if (user != null)
            {
                var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.User.Id == user.Id);

                if (parceiro != null)
                {
                    parceiro.Nome = "[USUÁRIO DESCONHECIDO]";
                    parceiro.Credito = 0;
                }

                await _context.SaveChangesAsync();
                var result = await _userManager.DeleteAsync(user);

                return result.Succeeded;
            }
            return false;
        }

        public async Task<bool> Autenticar(LoginParceiroRequest request)
        {
            var existe = await _context.Parceiros.AnyAsync(p => p.Cpf == request.Cpf);

            if (existe)
            {
                var result = await _signInManager.PasswordSignInAsync($"user_{CurrentTenantId}_{request.Cpf}", request.Senha, isPersistent: false, lockoutOnFailure: false);
                return result.Succeeded;
            }
            return false;
        }

        public async Task<(bool status, string? telefone)> ValidarRecuperacao(ValidarRecuperacaoRequest request)
        {
            var parceiro = await _context.Parceiros.FirstOrDefaultAsync(p => p.Cpf == request.Cpf);

            if (parceiro != null)
            {
                if (parceiro.Telefone == request.Telefone)
                {
                    return (true, parceiro.Telefone);
                }
                else
                {
                    return (false, $"*********{parceiro.Telefone.Substring(parceiro.Telefone.Length - 2)}");
                }
            }

            return (false, null);
        }

        public async Task<bool> RecuperarSenha(RecuperarSenhaRequest request)
        {
            if (request.Senha == request.Confirmacao && request.Senha.Length >= 6)
            {
                var parceiro = await _context.Parceiros
                    .Include(p => p.User)
                    .FirstOrDefaultAsync(p => p.Cpf == request.Cpf);

                if (parceiro != null)
                {
                    if (parceiro.User != null)
                    {
                        await _userManager.RemovePasswordAsync(parceiro.User);
                        await _userManager.AddPasswordAsync(parceiro.User, request.Senha);
                        await _context.SaveChangesAsync();
                        return true;
                    }
                }
            }

            return false;
        }

        public async Task<bool> Validar()
        {
            var userIdentity = _signInManager.Context.User.Identity;

            if (userIdentity != null)
            {
                var user = await _userManager.GetUserAsync(_signInManager.Context.User);
                bool temParceiro = await _context.Parceiros.AnyAsync(p => p.User == user);
                return (userIdentity.IsAuthenticated && temParceiro);
            }
            else
            {
                return false;
            }
        }

        public async Task<string> Desconectar()
        {
            await _signInManager.SignOutAsync();
            return "Deslogado com sucesso";
        }

        public async Task<byte[]?> GerarRelatorio(GerarRelatorioParceirosRequest request)
        {
            var query = _context.Parceiros.AsQueryable();

            if (!string.IsNullOrEmpty(request.Nome))
            {
                query = query.Where(p => p.Nome.StartsWith(request.Nome.ToUpper()));
            }

            if (request.Tipo.HasValue)
            {
                query = query.Where(p => p.Tipo == request.Tipo.Value);
            }

            if (request.Fechou.HasValue)
            {
                query = query.Where(p => p.Fechou == request.Fechou.Value);
            }

            if (request.FoiIndicado.HasValue)
            {
                if (request.FoiIndicado.Value)
                {
                    query = query.Where(p => _context.Indicacoes.Any(i => i.Indicado.Id == p.Id));
                }
                else
                {
                    query = query.Where(p => !_context.Indicacoes.Any(i => i.Indicado.Id == p.Id));
                }
            }

            if ((request.DataInicial.HasValue || request.DataFinal.HasValue) && !string.IsNullOrEmpty(request.TipoData))
            {
                if (request.DataFinal.HasValue)
                {
                    request.DataFinal = request.DataFinal.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                }

                if (request.TipoData == "criadoEm")
                {
                    if (request.DataInicial.HasValue && request.DataFinal.HasValue)
                    {
                        query = query.Where(p => p.CriadoEm >= request.DataInicial && p.CriadoEm <= request.DataFinal);
                    }
                    else if (request.DataInicial.HasValue)
                    {
                        query = query.Where(p => p.CriadoEm >= request.DataInicial);
                    }
                    else if (request.DataFinal.HasValue)
                    {
                        query = query.Where(p => p.CriadoEm <= request.DataFinal);
                    }
                }
                else if (request.TipoData == "fechouEm")
                {
                    if (request.DataInicial.HasValue && request.DataFinal.HasValue)
                    {
                        query = query.Where(p => p.FechouEm >= request.DataInicial && p.FechouEm <= request.DataFinal);
                    }
                    else if (request.DataInicial.HasValue)
                    {
                        query = query.Where(p => p.FechouEm >= request.DataInicial);
                    }
                    else if (request.DataFinal.HasValue)
                    {
                        query = query.Where(p => p.FechouEm <= request.DataFinal);
                    }
                }
            }

            var parceiros = await query.ToListAsync();

            var csv = new StringBuilder();
            csv.AppendLine("Id,Nome,Telefone,Data de Cadastro,Fechou Contrato?,Data de Fechamento");

            foreach (var parceiro in parceiros)
            {
                csv.AppendLine($"{parceiro.Id},{parceiro.Nome},{parceiro.Telefone}," +
                    $"{parceiro.CriadoEm:yyyy-MM-dd},{(parceiro.Fechou ? "Sim" : "Não")}," +
                    $"{(parceiro.FechouEm?.ToString("yyyy-MM-dd") ?? "N/A")}");
            }

            var bom = new byte[] { 0xEF, 0xBB, 0xBF };
            var csvBytes = Encoding.UTF8.GetBytes(csv.ToString());
            var result = bom.Concat(csvBytes).ToArray();

            return result;
        }

        public async Task<byte[]?> GerarRelacaoIndicadorIndicado()
        {
            var indicacoes = await _context.Indicacoes
                .Include(i => i.Indicado)
                .Include(i => i.Parceiro)
                .ToListAsync();

            var csv = new StringBuilder();
            csv.AppendLine("Nome do Indicador,Nome do Indicado,Data da Indicação");

            foreach (var indicacao in indicacoes)
            {
                csv.AppendLine($"{indicacao.Parceiro.Nome}, {indicacao.Indicado.Nome}, " +
                    $"{indicacao.Indicado.CriadoEm:yyyy-MM-dd}");
            }

            var bom = new byte[] { 0xEF, 0xBB, 0xBF };
            var csvBytes = Encoding.UTF8.GetBytes(csv.ToString());
            var result = bom.Concat(csvBytes).ToArray();

            return result;
        }
    }
}
