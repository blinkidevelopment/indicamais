namespace IndicaMais.Services.DTOs
{
    public class TransacaoMin
    {
        public int Id { get; set; }
        public DateTime Data { get; set; }
        public string NomeParceiro { get; set; }
        public int Valor { get; set; }
        public int Tipo { get; set; }
        public string? NomePremio { get; set; }
        public bool Baixa { get; set; }
    }
}
