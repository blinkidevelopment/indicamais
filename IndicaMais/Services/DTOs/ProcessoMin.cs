namespace IndicaMais.Services.DTOs
{
    public class ProcessoMin
    {
        public int Id { get; set; }
        public string Numero { get; set; }
        public string Nome { get; set; }
        public string? Descricao { get; set; }
        public bool PendenteAndamento { get; set; }
    }
}
