using IndicaMais.DbContexts;
using IndicaMais.Models;
using IndicaMais.Services.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MySqlX.XDevAPI.Common;

namespace IndicaMais.Services
{
    public class EmpresaService : IEmpresaService
    {
        private readonly ApplicationDbContext _context;

        public EmpresaService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Empresa> Buscar()
        {
            Empresa? empresa = await _context.Empresas.FirstOrDefaultAsync();
            return empresa;
        }

        public async Task<bool> Criar(CriarEmpresaRequest request)
        {
            var existe = await _context.Tenants.AnyAsync(t => t.Id == request.Subdominio);

            if (!existe)
            {
                if (request.Logo == null)
                {
                    return false;
                }

                var mtPermitidosLogo = new List<string> { "image/jpeg", "image/png", "image/svg+xml" };
                var mtPermitidosFavicon = new List<string> { "image/x-icon", "image/vnd.microsoft.icon" };
                var mtPermitidosAppleIcon = new List<string> { "image/png" };

                if (!mtPermitidosLogo.Contains(request.Logo.ContentType) || 
                    !mtPermitidosFavicon.Contains(request.Favicon.ContentType) ||
                    !mtPermitidosAppleIcon.Contains(request.AppleIcon.ContentType))
                {
                    return false;
                }

                byte[] logoBytes;
                using (var memoryStream = new MemoryStream())
                {
                    await request.Logo.CopyToAsync(memoryStream);
                    logoBytes = memoryStream.ToArray();
                }

                byte[] faviconBytes;
                using (var memoryStream = new MemoryStream())
                {
                    await request.Favicon.CopyToAsync(memoryStream);
                    faviconBytes = memoryStream.ToArray();
                }

                byte[] appleIconBytes;
                using (var memoryStream = new MemoryStream())
                {
                    await request.AppleIcon.CopyToAsync(memoryStream);
                    appleIconBytes = memoryStream.ToArray();
                }

                var tenant = new Tenant
                {
                    Id = request.Subdominio,
                    Nome = request.Nome
                };

                var empresa = new Empresa
                {
                    Nome = request.Nome,
                    NomeApp = request.NomeApp,
                    Logo = logoBytes,
                    LogoMimeType = request.Logo.ContentType,
                    Favicon = faviconBytes,
                    FaviconMimeType = request.Favicon.ContentType,
                    AppleIcon = appleIconBytes,
                    AppleIconMimeType = request.AppleIcon.ContentType,
                    CorPrimaria = request.CorPrimaria,
                    CorSecundaria = request.CorSecundaria,
                    CorTerciaria = request.CorTerciaria,
                    CorFundo = request.CorFundo,
                    CorFonte = request.CorFonte,
                    CorFonteSecundaria = request.CorFonteSecundaria,
                    Tenant = tenant
                };

                _context.Tenants.Add(tenant);
                _context.Empresas.Add(empresa);
                await _context.SaveChangesAsync();

                return true;
            }

            return false;
        }

        public async Task<IEnumerable<Configuracao>> ListarConfiguracoes()
        {
            var configuracoes = await _context.Configuracoes.ToListAsync();
            return configuracoes;
        }

        public async Task<bool> Editar(EditarEmpresaRequest request)
        {
            var empresa = await _context.Empresas.FirstOrDefaultAsync();

            if (empresa != null)
            {
                if (!request.Nome.IsNullOrEmpty())
                {
                    empresa.Nome = request.Nome;
                }

                if (!request.NomeApp.IsNullOrEmpty())
                {
                    empresa.NomeApp = request.NomeApp;
                }

                if (request.Logo != null)
                {
                    var mimeTypesPermitidos = new List<string> { "image/jpeg", "image/png", "image/svg+xml" };

                    if (!mimeTypesPermitidos.Contains(request.Logo.ContentType))
                    {
                        return false;
                    }

                    byte[] logoBytes;
                    using (var memoryStream = new MemoryStream())
                    {
                        await request.Logo.CopyToAsync(memoryStream);
                        logoBytes = memoryStream.ToArray();
                    }

                    empresa.Logo = logoBytes;
                    empresa.LogoMimeType = request.Logo.ContentType;
                }

                if (!request.CorPrimaria.IsNullOrEmpty())
                {
                    empresa.CorPrimaria = request.CorPrimaria;
                }

                if (!request.CorSecundaria.IsNullOrEmpty())
                {
                    empresa.CorSecundaria = request.CorSecundaria;
                }

                if (!request.CorTerciaria.IsNullOrEmpty())
                {
                    empresa.CorTerciaria = request.CorTerciaria;
                }

                if (!request.CorFundo.IsNullOrEmpty())
                {
                    empresa.CorFundo = request.CorFundo;
                }

                if (!request.CorFonte.IsNullOrEmpty())
                {
                    empresa.CorFonte = request.CorFonte;
                }

                if (!request.CorFonteSecundaria.IsNullOrEmpty())
                {
                    empresa.CorFonteSecundaria = request.CorFonteSecundaria;
                }

                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> EditarConfiguracao(string chave, int valor)
        {
            if (valor > 0)
            {
                var configuracao = await _context.Configuracoes.FirstOrDefaultAsync(c => c.Chave == chave);

                if (configuracao != null)
                {
                    configuracao.Valor = valor;
                    await _context.SaveChangesAsync();
                    return true;
                }
            }

            return false;
        }

        public async Task<int> BuscarValorPonto()
        {
            var valor = await _context.Configuracoes.Where(c => c.Chave == "convPontVal").Select(c => c.Valor).FirstOrDefaultAsync();
            return valor;
        }
    }
}
