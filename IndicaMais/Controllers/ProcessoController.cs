using IndicaMais.Services;
using IndicaMais.Services.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IndicaMais.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProcessoController : ControllerBase
    {
        private readonly IProcessoService _processoService;

        public ProcessoController(IProcessoService processoService) {
            _processoService = processoService;
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpGet("{id}")]
        public async Task<IActionResult> Buscar(int id)
        {
            var processo = await _processoService.Buscar(id);
            return Ok(processo);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpGet("listar")]
        public async Task<IActionResult> Listar([FromQuery] int pagina, int tamanho, string? nomeParceiro, string? cpf, string? nomeProcesso, string? numeroProcesso, bool? pendenteAndamento)
        {
            var result = await _processoService.Listar(pagina, tamanho, nomeParceiro, cpf, nomeProcesso, numeroProcesso, pendenteAndamento);
            return Ok(new { result.processos, result.temMais });
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpPatch("{id}")]
        public async Task<IActionResult> Editar(EditarProcessoRequest request, int id)
        {
            var result = await _processoService.Editar(request, id);
            return Ok(result);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Excluir(int id)
        {
            var result = await _processoService.Excluir(id);
            return Ok(result);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpPost("{id}/andamento")]
        public async Task<IActionResult> CriarAndamento(CriarAndamentoRequest request, int id)
        {
            var result = await _processoService.CriarAndamento(request, id);
            return Ok(result);
        }

        [HttpGet("{id}/andamento/solicitar")]
        public async Task<IActionResult> PedirAndamento(int id)
        {
            var result = await _processoService.PedirAndamento(id);
            return Ok(result);
        }

        [HttpGet("{id}/andamentos")]
        public async Task<IActionResult> ListarAndamentos(int id, [FromQuery] int pagina, int tamanho)
        {
            var result = await _processoService.ListarAndamentos(id, pagina, tamanho);
            return Ok(new { result.andamentos, result.temMais });
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpPatch("{id}/andamento/{idAndamento}")]
        public async Task<IActionResult> EditarAndamento(EditarAndamentoRequest request, int idAndamento)
        {
            var result = await _processoService.EditarAndamento(request, idAndamento);
            return Ok(result);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpDelete("{id}/andamento/{idAndamento}")]
        public async Task<IActionResult> ExcluirAndamento(int idAndamento)
        {
            var result = await _processoService.ExcluirAndamento(idAndamento);
            return Ok(result);
        }
    }
}
