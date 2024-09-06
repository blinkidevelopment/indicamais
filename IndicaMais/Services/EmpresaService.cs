using IndicaMais.DbContexts;
using IndicaMais.Models;
using Microsoft.EntityFrameworkCore;

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

        public async Task<IEnumerable<Configuracao>> ListarConfiguracoes()
        {
            var configuracoes = await _context.Configuracoes.ToListAsync();
            return configuracoes;
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
