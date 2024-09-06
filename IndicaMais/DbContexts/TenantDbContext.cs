using IndicaMais.Models;
using Microsoft.EntityFrameworkCore;

namespace IndicaMais.DbContexts
{
    public class TenantDbContext : DbContext
    {
        public TenantDbContext(DbContextOptions<TenantDbContext> options) : base(options)
        {
        }

        public DbSet<Tenant> Tenants { get; set; }
    }
}
