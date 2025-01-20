namespace IndicaMais.Services.DTOs
{
    public class CriarParceiroInternamenteRequest
    {
        public string Nome { get; set; }
        public string Telefone { get; set; }
        public string Cpf { get; set; }
        public int Tipo { get; set; }
        public string Senha { get; set; }
        public string Confirmacao { get; set; }
        public int? IdIndicador { get; set; }
        public bool ContratoFechado { get; set; }
    }
}
