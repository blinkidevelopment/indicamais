using IndicaMais.Models;

namespace IndicaMais.Services
{
    public interface IEmpresaService
    {
        Task <Empresa> Buscar();
        Task<IEnumerable<Configuracao>> ListarConfiguracoes();
        Task<bool> EditarConfiguracao(string chave, int valor);
        Task<int> BuscarValorPonto();
    }
}
