using System.ComponentModel.DataAnnotations;

namespace IndicaMais.Models
{
    public class Premio : IMustHaveTenant
    {
        [Key]
        public int Id { get; set; }

        [StringLength(30)]
        public string Nome { get; set; }

        public int Valor { get; set; }

        [StringLength(255)]
        public string Descricao { get; set; }

        [StringLength(255)]
        public string Imagem { get; set; }

        public bool Disponivel { get; set; }

        [Required]
        public Tenant Tenant { get; set; }
    }
}
