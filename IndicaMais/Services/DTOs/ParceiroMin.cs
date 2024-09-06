namespace IndicaMais.Services.DTOs
{
    public class ParceiroMin
    {
        public string Nome { get; set; }
        public string? Cpf { get; set; }
        public string Telefone { get; set; }
        public int Credito { get; set; }
        public int Tipo { get; set; }
        public string? IndicadoPor { get; set; }
        public bool Fechou { get; set; }
    }
}
