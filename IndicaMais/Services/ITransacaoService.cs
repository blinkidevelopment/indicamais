using IndicaMais.Services.DTOs;

namespace IndicaMais.Services
{
    public interface ITransacaoService
    {
        Task<bool> Criar(CriarTransacaoRequest request);
        Task<(IEnumerable<TransacaoParceiroMin> transacoes, bool temMais)> Listar(int pagina, int tamanho);
        Task<(IEnumerable<TransacaoMin> transacoes, bool temMais)> Listar(int id, int pagina, int tamanho);
        Task<(IEnumerable<TransacaoMin> transacoes, bool temMais)> Listar(int pagina, int tamanho, int? tipo, bool? baixa, string? nome, string? cpf);
        Task<bool> MudarStatus(int id);
    }
}
