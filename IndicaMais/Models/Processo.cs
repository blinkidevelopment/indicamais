using System.ComponentModel.DataAnnotations;

namespace IndicaMais.Models
{
    public class Processo : IMustHaveTenant
    {
        [Key]
        public int Id { get; set; }

        [StringLength(60)]
        public string Numero { get; set; }

        [StringLength(150)]
        public string Nome { get; set; }

        public string? Descricao { get; set; }

        public bool PendenteAndamento { get; set; } = false;

        [Required]
        public Parceiro Parceiro { get; set; }

        [Required]
        public Tenant Tenant { get; set; }
    }
}
