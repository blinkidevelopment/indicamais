using IndicaMais.Models;
using IndicaMais.Services;
using IndicaMais.Services.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IndicaMais.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuarioController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Criar(CriarUsuarioRequest request)
        {
            var result = await _usuarioService.Criar(request);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("listar")]
        public async Task<IActionResult> Listar()
        {
            var usuarios = await _usuarioService.Listar();
            return Ok(usuarios);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}")]
        public async Task<IActionResult> Editar(EditarUsuarioRequest request, string id)
        {
            var result = await _usuarioService.Editar(id, request);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Excluir(string id)
        {
            var result = await _usuarioService.Excluir(id);
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("autenticar")]
        public async Task<IActionResult> Autenticar(LoginUsuarioRequest request)
        {
            var result = await _usuarioService.Autenticar(request);
            return result ? Ok(true) : Unauthorized();
        }

        [HttpGet("validar")]
        public async Task<IActionResult> Validar()
        {
            var result = await _usuarioService.Validar();
            return Ok(result);
        }

        [HttpGet("desconectar")]
        public async Task<IActionResult> Desconectar()
        {
            var result = await _usuarioService.Desconectar();
            return Ok(new { message = result });
        }
    }
}
