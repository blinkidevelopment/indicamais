using IndicaMais.Services.DTOs;

namespace IndicaMais.Services
{
    public interface IUsuarioService
    {
        Task<bool> Criar(CriarUsuarioRequest request);
        Task<IEnumerable<UsuarioMin>> Listar();
        Task<bool> Editar(string id, EditarUsuarioRequest request);
        Task<bool> Excluir(string id);
        Task<bool> Autenticar(LoginUsuarioRequest request);
        Task<bool> Validar();
        Task<string> Desconectar();
    }
}
