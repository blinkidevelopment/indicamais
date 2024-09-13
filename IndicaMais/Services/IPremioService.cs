using IndicaMais.Models;
using IndicaMais.Services.DTOs;

namespace IndicaMais.Services
{
    public interface IPremioService
    {
        Task<bool> Criar(CriarPremioRequest request);
        Task<IEnumerable<Premio>> Listar();
        Task<IEnumerable<Premio>> ListarPremiosDisponiveis();
        Task<bool> Resgatar(int id);
        Task<bool> Editar(EditarPremioRequest request, int id);
        Task<bool> Excluir(int id);
    }
}
