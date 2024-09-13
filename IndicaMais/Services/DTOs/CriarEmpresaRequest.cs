namespace IndicaMais.Services.DTOs
{
    public class CriarEmpresaRequest
    {
        public string Nome { get; set; }
        public string NomeApp { get; set; }
        public IFormFile Logo { get; set; }
        public IFormFile Favicon { get; set; }
        public IFormFile AppleIcon { get; set; }
        public string CorPrimaria { get; set; }
        public string CorSecundaria { get; set; }
        public string CorTerciaria { get; set; }
        public string CorFundo { get; set; }
        public string CorFonte { get; set; }
        public string CorFonteSecundaria { get; set; }
        public string Subdominio { get; set; }
    }
}
