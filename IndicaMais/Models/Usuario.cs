using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace IndicaMais.Models
{
    public class Usuario : IdentityUser, IMustHaveTenant
    {
        private string? _name;

        [StringLength(60)]
        public string? Name { get => _name; set => _name = value?.ToUpper(); }

        [Required]
        public bool IsStaff { get; set; } = false;

        [Required]
        public bool IsRoot { get; set; } = false;

        [Required]
        public Tenant Tenant { get; set; }
    }
}
