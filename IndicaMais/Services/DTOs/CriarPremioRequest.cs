namespace IndicaMais.Services.DTOs
{
    public class CriarPremioRequest
    {
        public string Nome { get; set; }
        public int Valor { get; set; }
        public bool Disponivel { get; set; }
        public string Descricao { get; set; }
        public string Imagem { get; set; }
    }
}
