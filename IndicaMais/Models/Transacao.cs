using System.ComponentModel.DataAnnotations;

namespace IndicaMais.Models
{
    public class Transacao : IMustHaveTenant
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Parceiro Parceiro { get; set; }

        [Required]
        public int Valor { get; set; }

        public int Tipo { get; set; } = 2;

        public bool Baixa { get; set; } = false;

        public DateTime Data {  get; set; } = DateTime.UtcNow;

        public Premio? Premio { get; set; }

        [Required]
        public Tenant Tenant { get; set; }
    }
}
