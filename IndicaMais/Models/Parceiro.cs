using System.ComponentModel.DataAnnotations;

namespace IndicaMais.Models
{
    public class Parceiro : IMustHaveTenant
    {
        private string _nome;

        [Key]
        public int Id { get; set; }

        [StringLength(60)]
        public string Nome { get => _nome; set => _nome = value.ToUpper(); }

        [Required]
        [StringLength(11)]
        public string Telefone { get; set; }

        [StringLength(11)]
        public string? Cpf { get; set; }

        public int Credito { get; set; } = 0;

        public int Tipo { get; set; } = 0;

        public bool Fechou { get; set; } = false;

        public bool Repassado { get; set; } = false;

        public bool Login { get; set; } = true;

        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

        public DateTime? FechouEm { get; set; }

        public Guid CodigoIndicacao { get; set; } = Guid.NewGuid();

        [Required]
        public Tenant Tenant { get; set; }

        public Usuario? User { get; set; }
    }
}
