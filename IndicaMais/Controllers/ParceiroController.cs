using IndicaMais.Models;
using IndicaMais.Services;
using IndicaMais.Services.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace IndicaMais.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ParceiroController : ControllerBase
    {
        private readonly IParceiroService _parceiroService;
        private readonly ITransacaoService _transacaoService;
        private readonly IProcessoService _processoService;

        public ParceiroController(IParceiroService parceiroService, ITransacaoService transacaoService, IProcessoService processoService)
        {
            _parceiroService = parceiroService;
            _transacaoService = transacaoService;
            _processoService = processoService;
        }

        [HttpGet]
        public async Task<IActionResult> Buscar()
        {
            var parceiro = await _parceiroService.Buscar();
            return Ok(parceiro);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpGet("{id}")]
        public async Task<IActionResult> Buscar(int id)
        {
            var parceiro = await _parceiroService.Buscar(id);
            return Ok(parceiro);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpGet("buscar/{nome}")]
        public async Task<IActionResult> BuscarNome(string nome)
        {
            var parceiro = await _parceiroService.BuscarNome(nome);
            return Ok(parceiro);
        }

        [AllowAnonymous]
        [HttpGet("{codigoIndicacao}/nome")]
        public async Task<IActionResult> BuscarNomeCodigo(string codigoIndicacao)
        {
            string nome = await _parceiroService.BuscarNomeCodigo(codigoIndicacao);
            return Ok(nome);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Criar(CriarParceiroRequest request)
        {
            var result = await _parceiroService.Criar(request);
            return Ok(result);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpPost("criar-interno")]
        public async Task<IActionResult> Criar(CriarParceiroInternamenteRequest request)
        {
            var result = await _parceiroService.Criar(request);
            return Ok(result);
        }

        [HttpPatch]
        public async Task<IActionResult> Editar(EditarParceiroRequest request)
        {
            var result = await _parceiroService.Editar(request);
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("checar")]
        public async Task<IActionResult> ChecarExistencia([FromQuery] string? telefone, string? cpf)
        {
            if (!cpf.IsNullOrEmpty())
            {
                var result = await _parceiroService.ChecarExistencia(cpf);
                return Ok(new { result.statusCRM, result.status });
            }
            else if (!telefone.IsNullOrEmpty())
            {
                bool? result = await _parceiroService.ChecarExistenciaIndicado(telefone);
                return Ok(result);
            }
            else
            {
                return BadRequest();
            }
        }

        [AllowAnonymous]
        [HttpPatch("{telefone}")]
        public async Task<IActionResult> AtualizarIndicado(AtualizarIndicadoRequest request, string telefone)
        {
            var result = await _parceiroService.AtualizarIndicado(request, telefone);
            return Ok(result);
        }

        [HttpPost("indicar")]
        public async Task<IActionResult> Indicar(CriarIndicacaoRequest request)
        {
            var result = await _parceiroService.CriarIndicacao(request);
            return result ? Ok(true) : Conflict();
        }

        [AllowAnonymous]
        [HttpPost("indicar/{codigoIndicacao}")]
        public async Task<IActionResult> Indicar(CriarIndicacaoRequest request, string codigoIndicacao)
        {
            var result = await _parceiroService.CriarIndicacao(request, codigoIndicacao);
            return result ? Ok(true) : Conflict();
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpGet("listar")]
        public async Task<IActionResult> Listar([FromQuery] int pagina, int tamanho, string? nome, string? cpf, int? tipo, bool? fechou, bool? indicado)
        {
            var result = await _parceiroService.Listar(pagina, tamanho, nome, cpf, tipo, fechou, indicado);
            return Ok(new { result.parceiros, result.temMais });
        }

        [HttpGet("indicacoes")]
        public async Task<IActionResult> ListarIndicacoes([FromQuery] int pagina, int tamanho)
        {
            var result = await _parceiroService.ListarIndicacoes(pagina, tamanho);
            return Ok(new { result.indicacoes, result.temMais });
        }

        [HttpGet("indicacoes/contar")]
        public async Task<IActionResult> ContarIndicacoes([FromQuery] bool fechadas)
        {
            var result = await _parceiroService.ContarIndicacoes(fechadas);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("indicacoes/contar/todas")]
        public async Task<IActionResult> ContarTodasIndicacoes([FromQuery] bool fechadas, DateTime? dataInicial, DateTime? dataFinal)
        {
            var result = await _parceiroService.ContarTodasIndicacoes(fechadas, dataInicial, dataFinal);
            return Ok(result);
        }

        [HttpGet("transacoes")]
        public async Task<IActionResult> ListarTransacoes([FromQuery] int pagina, int tamanho)
        {
            var result = await _transacaoService.Listar(pagina, tamanho);
            return Ok(new { result.transacoes, result.temMais });
        }

        [HttpGet("cobrancas")]
        public async Task<IActionResult> ListarCobrancas([FromQuery] int pagina)
        {
            var result = await _parceiroService.ListarCobrancas(pagina);
            return Ok(result);
        }

        [HttpGet("processos")]
        public async Task<IActionResult> ListarProcessos([FromQuery] int pagina, int tamanho)
        {
            var result = await _processoService.Listar(pagina, tamanho);
            return Ok(new { result.processos, result.temMais });
        }

        [HttpDelete]
        public async Task<IActionResult> Excluir()
        {
            var result = await _parceiroService.Excluir();
            return Ok(result);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpGet("{id}/indicacoes")]
        public async Task<IActionResult> ListarIndicacoes(int id, [FromQuery] int pagina, int tamanho)
        {
            var result = await _parceiroService.ListarIndicacoes(id, pagina, tamanho);
            return Ok(new { result.indicacoes, result.temMais });
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpGet("{id}/indicacoes/contar")]
        public async Task<IActionResult> ContarIndicacoes(int id, [FromQuery] bool fechadas)
        {
            var result = await _parceiroService.ContarIndicacoes(id, fechadas);
            return Ok(result);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpGet("{id}/transacoes")]
        public async Task<IActionResult> ListarTransacoes(int id, [FromQuery] int pagina, int tamanho)
        {
            var result = await _transacaoService.Listar(id, pagina, tamanho);
            return Ok(new { result.transacoes, result.temMais });
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpPatch("{id}/alterar-senha")]
        public async Task<IActionResult> AlterarSenha(AlterarSenhaRequest request, int id)
        {
            var result = await _parceiroService.AlterarSenha(request, id);
            return Ok(result);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpPatch("{id}/alterar-status")]
        public async Task<IActionResult> AlterarStatus(int id)
        {
            var result = await _parceiroService.AlterarStatus(id);
            return Ok(result);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpPatch("{id}/alterar-status-repasse")]
        public async Task<IActionResult> AlterarStatusRepasse(int id)
        {
            var result = await _parceiroService.AlterarStatusRepasse(id);
            return Ok(result);
        }

        [Authorize(Roles = "Admin,Gestor")]
        [HttpPost("{id}/processo")]
        public async Task<IActionResult> CriarProcesso(CriarProcessoRequest request, int id)
        {
            var result = await _processoService.Criar(request, id);
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("autenticar")]
        public async Task <IActionResult> Autenticar(LoginParceiroRequest request)
        {
            var resultado = await _parceiroService.Autenticar(request);
            return resultado ? Ok(true) : Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("recuperar")]
        public async Task<IActionResult> RecuperarSenha(RecuperarSenhaRequest request)
        {
            var result = await _parceiroService.RecuperarSenha(request);
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("recuperar/validar")]
        public async Task <IActionResult> ValidarRecuperacao(ValidarRecuperacaoRequest request)
        {
            var (status, telefone) = await _parceiroService.ValidarRecuperacao(request);
            return Ok(new { status, telefone });
        }

        [HttpGet("validar")]
        public async Task<IActionResult> Validar()
        {
            var result = await _parceiroService.Validar();
            return Ok(result);
        }

        [HttpGet("desconectar")]
        public async Task<IActionResult> Desconectar()
        {
            var resultado = await _parceiroService.Desconectar();
            return Ok(new { message = resultado });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("relatorio")]
        public async Task<IActionResult> GerarRelatorio(GerarRelatorioParceirosRequest request)
        {
            var result = await _parceiroService.GerarRelatorio(request);
            return File(result, "text/csv", "relatorio_parceiros.csv");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("relatorio/relacao-indicador-indicado")]
        public async Task<IActionResult> GerarRelacaoIndicadorIndicado()
        {
            var result = await _parceiroService.GerarRelacaoIndicadorIndicado();
            return File(result, "text/csv", "relacao_indicador_indicado.csv");
        }
    }
}
