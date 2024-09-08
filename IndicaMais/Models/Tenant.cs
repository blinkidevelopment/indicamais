using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace IndicaMais.Models
{
    public class Tenant
    {
        private string _nome;

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string Id { get; set; }

        [StringLength(255)]
        public string Nome { get => _nome; set => _nome = value.ToLower(); }
    }
}
