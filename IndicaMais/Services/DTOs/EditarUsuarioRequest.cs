﻿namespace IndicaMais.Services.DTOs
{
    public class EditarUsuarioRequest
    {
        public string? Nome { get; set; }
        public string? Email {  get; set; }
        public string? Senha { get; set; }
        public string? Confirmacao { get; set; }
        public string? Cargo { get; set; }
    }
}
