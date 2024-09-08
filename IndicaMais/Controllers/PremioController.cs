using IndicaMais.Services;
using IndicaMais.Services.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IndicaMais.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PremioController : ControllerBase
    {
        private readonly IPremioService _premioService;

        public PremioController(IPremioService premioService)
        {
            _premioService = premioService;
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpPost]
        public async Task<IActionResult> Criar(CriarPremioRequest request)
        {
            var premios = await _premioService.Criar(request);
            return Ok(premios);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpGet("listar")]
        public async Task<IActionResult> Listar()
        {
            var result = await _premioService.Listar();
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> ListarDisponiveis()
        {
            var premios = await _premioService.ListarPremiosDisponiveis();
            return Ok(premios);
        }

        [HttpGet("{id}/resgatar")]
        public async Task<IActionResult> Resgatar(int id)
        {
            var result = await _premioService.Resgatar(id);
            return Ok(result);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpPatch("{id}")]
        public async Task<IActionResult> Editar(EditarPremioRequest request, int id)
        {
            var result = await _premioService.Editar(id, request);
            return Ok(result);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Excluir(int id)
        {
            var result = await _premioService.Excluir(id);
            return Ok(result);
        }
    }
}
