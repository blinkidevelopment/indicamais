using IndicaMais.Services;
using IndicaMais.Services.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IndicaMais.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TransacaoController : ControllerBase
    {
        private readonly ITransacaoService _transacaoService;

        public TransacaoController(ITransacaoService transacaoService)
        {
            _transacaoService = transacaoService;
        }

        [HttpPost]
        public async Task<IActionResult> Post(CriarTransacaoRequest request)
        {
            var result = await _transacaoService.Criar(request);
            return Ok(result);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpGet("listar")]
        public async Task<IActionResult> Listar([FromQuery] int pagina, int tamanho, int? tipo, bool? baixa, string? nome, string? cpf)
        {
            var result = await _transacaoService.Listar(pagina, tamanho, tipo, baixa, nome, cpf);
            return Ok(new { result.transacoes, result.temMais });
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpPatch("{id}/mudar-status")]
        public async Task<IActionResult> MudarStatus(int id)
        {
            var result = await _transacaoService.MudarStatus(id);
            return Ok(result);
        }
    }
}
