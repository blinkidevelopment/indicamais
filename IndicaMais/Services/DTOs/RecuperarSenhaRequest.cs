namespace IndicaMais.Services.DTOs
{
    public class RecuperarSenhaRequest
    {
        public string Cpf { get; set; }
        public string Telefone { get; set; }
        public string Senha { get; set; }
        public string Confirmacao { get; set; }
    }
}
