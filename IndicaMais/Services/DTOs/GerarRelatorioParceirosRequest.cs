namespace IndicaMais.Services.DTOs
{
    public class GerarRelatorioParceirosRequest
    {
        public string? Nome { get; set; }
        public int? Tipo { get; set; }
        public bool? Fechou { get; set; }
        public bool? FoiIndicado { get; set; }
        public DateTime? DataInicial { get; set; }
        public DateTime? DataFinal { get; set; }
        public string? TipoData { get; set; }
    }
}
