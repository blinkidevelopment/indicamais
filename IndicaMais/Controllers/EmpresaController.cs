using IndicaMais.Models;
using IndicaMais.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IndicaMais.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EmpresaController : ControllerBase
    {
        private readonly IEmpresaService _empresaService;

        public EmpresaController(IEmpresaService empresaService)
        {
            _empresaService = empresaService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Buscar()
        {
            Empresa empresa = await _empresaService.Buscar();
            return Ok(empresa);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("configuracoes")]
        public async Task<IActionResult> ListarConfiguracoes()
        {
            var configuracoes = await _empresaService.ListarConfiguracoes();
            return Ok(configuracoes);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("configuracao/{chave}")]
        public async Task<IActionResult> EditarConfiguracao(string chave, [FromQuery] int valor)
        {
            var result = await _empresaService.EditarConfiguracao(chave, valor);
            return Ok(result);
        }

        [HttpGet("valor-ponto")]
        public async Task<IActionResult> BuscarValorPonto()
        {
            var valor = await _empresaService.BuscarValorPonto();
            return Ok(valor);
        }
    }
}
