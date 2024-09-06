using IndicaMais.Models;
using IndicaMais.Services.DTOs;
using IndicaMais.Services.Integrations;

namespace IndicaMais.Services
{
    public interface IParceiroService
    {
        Task<Parceiro> Buscar();
        Task<Parceiro> Buscar(string cpf);
        Task<ParceiroMin> Buscar(int id);
        Task<(IEnumerable<Parceiro> parceiros, bool temMais)> Listar(int pagina, int tamanho, string? nome, string? cpf, int? tipo, bool? fechou, bool? indicado);
        Task<bool> Criar(CriarParceiroRequest request);
        Task<bool> Criar(CriarParceiroInternamenteRequest request);
        Task<(bool statusCRM, bool status)> ChecarExistencia(string cpf);
        Task<bool?> ChecarExistenciaIndicado(string telefone);
        Task<bool> CriarIndicacao(CriarIndicacaoRequest request);
        Task<(IEnumerable<IndicadoMin> indicacoes, bool temMais)> ListarIndicacoes(int pagina, int tamanho);
        Task<(IEnumerable<Indicado> indicacoes, bool temMais)> ListarIndicacoes(int id, int pagina, int tamanho);
        Task<RespostaAPI> ListarCobrancas(int pagina);
        Task<int> ContarIndicacoes(bool fechadas);
        Task<int> ContarIndicacoes(int id, bool fechadas);
        Task<bool> Editar(EditarParceiroRequest request);
        Task<bool> AlterarSenha(int id, AlterarSenhaRequest request);
        Task<bool> AlterarStatus(int id);
        Task<bool> AlterarStatusRepasse(int id);
        Task<bool> AtualizarIndicado(AtualizarIndicadoRequest request, string telefone);
        Task<bool> Excluir();
        Task<bool> Autenticar(LoginParceiroRequest request);
        Task<(bool status, string? telefone)> ValidarRecuperacao(ValidarRecuperacaoRequest request);
        Task<bool> RecuperarSenha(RecuperarSenhaRequest request);
        Task<bool> Validar();
        Task<string> Desconectar();
    }
}
