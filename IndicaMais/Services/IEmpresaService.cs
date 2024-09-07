using IndicaMais.Models;
using IndicaMais.Services.DTOs;

namespace IndicaMais.Services
{
    public interface IEmpresaService
    {
        Task <Empresa> Buscar();
        Task <bool> Criar(CriarEmpresaRequest request);
        Task<IEnumerable<Configuracao>> ListarConfiguracoes();
        Task<bool> Editar(EditarEmpresaRequest request);
        Task<bool> EditarConfiguracao(string chave, int valor);
        Task<int> BuscarValorPonto();
    }
}
