namespace IndicaMais.Services.DTOs
{
    public class GerarRelatorioTransacoesRequest
    {
        public string? Nome { get; set; }
        public int? Tipo { get; set; }
        public bool? Baixa { get; set; }
        public DateTime? DataInicial { get; set; }
        public DateTime? DataFinal { get; set; }
        public int? Premio { get; set; }
    }
}
