namespace IndicaMais.Services.DTOs
{
    public class Indicado
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string? Cpf { get; set; }
        public string Telefone { get; set; }
        public bool Fechou { get; set; }
        public bool Repassado { get; set; }
    }
}
