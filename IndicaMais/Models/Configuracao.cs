using System.ComponentModel.DataAnnotations;

namespace IndicaMais.Models
{
    public class Configuracao : IMustHaveTenant
    {
        [Key]
        public int Id { get; set; }

        public string Chave { get; set; }

        public int Valor { get; set; }

        public string Nome { get; set; }

        [Required]
        public Tenant Tenant { get; set; }
    }
}
