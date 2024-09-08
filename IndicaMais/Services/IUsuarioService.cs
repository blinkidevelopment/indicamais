using IndicaMais.Models;
using IndicaMais.Services.DTOs;
using Microsoft.AspNetCore.Identity;

namespace IndicaMais.Services
{
    public interface IUsuarioService
    {
        Task<UsuarioMin> Buscar();
        Task<bool> Criar(CriarUsuarioRequest request);
        Task<bool> CriarUsuarioRaiz(CriarUsuarioRaizRequest request);
        Task<IEnumerable<UsuarioMin>> Listar();
        Task<bool> Editar(string id, EditarUsuarioRequest request);
        Task<bool> Excluir(string id);
        Task<bool> Autenticar(LoginUsuarioRequest request);
        Task<bool> Validar();
        Task<string> Desconectar();
        Task<bool> CriarCargo(CriarCargoRequest request);
        Task<IEnumerable<string>> ListarCargos();
        Task<IdentityResult> CadastrarAdministradorAsync(string email, string password);
    }
}
