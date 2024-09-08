namespace IndicaMais.Services.DTOs
{
    public class UsuarioMin
    {
        public string Id {  get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool IsRoot { get; set; }
        public string? Role { get; set; }
    }
}
