using System.ComponentModel.DataAnnotations;

namespace IndicaMais.Models
{
    public class Andamento : IMustHaveTenant
    {
        [Key]
        public int Id { get; set; }

        public string Descricao { get; set; }

        public DateTime Data { get; set; } = DateTime.UtcNow;

        [Required]
        public Processo Processo { get; set; }

        [Required]
        public Tenant Tenant { get; set; }
    }
}
