using System.ComponentModel.DataAnnotations;

namespace IndicaMais.Models
{
    public class Empresa : IMustHaveTenant
    {
        [Key]
        public int Id { get; set; }
        [StringLength(255)]
        public string Nome { get; set; }
        public byte[]? Logo { get; set; }
        [StringLength(7)]
        public string CorPrimaria { get; set; }
        [StringLength(7)]
        public string CorSecundaria { get; set; }
        [StringLength(7)]
        public string CorTerciaria { get; set; }
        [StringLength(7)]
        public string CorFundo { get; set; }
        [StringLength(7)]
        public string CorFonte { get; set; }
        [StringLength(7)]
        public string CorFonteSecundaria { get; set; }
        [Required]
        public Tenant Tenant { get; set; }
    }
}
