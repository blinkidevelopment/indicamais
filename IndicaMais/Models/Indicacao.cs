using System.ComponentModel.DataAnnotations;

namespace IndicaMais.Models
{
    public class Indicacao : IMustHaveTenant
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public Parceiro Parceiro { get; set; }
        [Required]
        public Parceiro Indicado { get; set; }
        [Required]
        public Tenant Tenant { get; set; }
    }
}
