namespace IndicaMais.Services.DTOs
{
    public class ProcessoMax
    {
        public int Id { get; set; }
        public string Numero { get; set; }
        public string Nome { get; set; }
        public string? Descricao { get; set; }
        public bool PendenteAndamento { get; set; }
        public string NomeParceiro { get; set; }
        public string? CpfParceiro { get; set; }
    }
}
