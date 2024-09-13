using IndicaMais.Models;
using IndicaMais.Services.DTOs;

namespace IndicaMais.Services
{
    public interface IProcessoService
    {
        Task<ProcessoMax> Buscar(int id);
        Task<bool> Criar(CriarProcessoRequest request, int idParceiro);
        Task<(IEnumerable<ProcessoMin> processos, bool temMais)> Listar(int pagina, int tamanho);
        Task<(IEnumerable<ProcessoMax>? processos, bool temMais)> Listar(int pagina, int tamanho, string? nomeParceiro, string? cpf, string? nomeProcesso, string? numeroProcesso, bool? pendenteAndamento);
        Task<bool> Editar(EditarProcessoRequest request, int id);
        Task<bool> Excluir(int id);
        Task<bool> CriarAndamento(CriarAndamentoRequest request, int id);
        Task<bool> PedirAndamento(int id);
        Task<(IEnumerable<AndamentoMin>? andamentos, bool temMais)> ListarAndamentos(int id, int pagina, int tamanho);
        Task<bool> EditarAndamento(EditarAndamentoRequest request, int id);
        Task<bool> ExcluirAndamento(int id);
    }
}
