using IndicaMais.Services;
using IndicaMais.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace IndicaMais.DbContexts
{
    public class ApplicationDbContext : IdentityDbContext<Usuario>
    {
        private readonly ICurrentTenantService _currentTenantService;
        public string CurrentTenantId { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ICurrentTenantService currentTenantService) : base(options)
        {
            _currentTenantService = currentTenantService;
            CurrentTenantId = _currentTenantService.TenantId;
        }

        public DbSet<Parceiro> Parceiros { get; set; }
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<Empresa> Empresas { get; set; }
        public DbSet<Premio> Premios { get; set; }
        public DbSet<Indicacao> Indicacao { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }
        public DbSet<Configuracao> Configuracoes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Parceiro>().HasQueryFilter(a => a.Tenant.Id == CurrentTenantId);
            builder.Entity<Parceiro>().HasIndex("Cpf", "TenantId").IsUnique(true);
            builder.Entity<Parceiro>().HasIndex("Telefone", "TenantId").IsUnique(true);

            builder.Entity<Usuario>().HasQueryFilter(u => u.Tenant.Id == CurrentTenantId).HasIndex("Email", "TenantId").IsUnique(true);
            builder.Entity<Empresa>().HasQueryFilter(a => a.Tenant.Id == CurrentTenantId);
            builder.Entity<Premio>().HasQueryFilter(a => a.Tenant.Id == CurrentTenantId);
            builder.Entity<Indicacao>().HasQueryFilter(a => a.Tenant.Id == CurrentTenantId).HasIndex("IndicadoId").IsUnique(true);
            builder.Entity<Transacao>().HasQueryFilter(a => a.Tenant.Id == CurrentTenantId);
            builder.Entity<Configuracao>().HasQueryFilter(c => c.Tenant.Id == CurrentTenantId).HasIndex("Chave", "TenantId").IsUnique(true);

            base.OnModelCreating(builder);
        }

        public override int SaveChanges()
        {
            foreach (var entry in ChangeTracker.Entries<IMustHaveTenant>().ToList())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                    case EntityState.Modified:
                        entry.Entity.Tenant.Id = CurrentTenantId;
                        break;
                }
            }
            var result = base.SaveChanges();
            return result;
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<IMustHaveTenant>().ToList())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                    case EntityState.Modified:
                        var tenant = await Tenants.SingleOrDefaultAsync(t => t.Id == CurrentTenantId, cancellationToken);

                        if (tenant == null)
                        {
                            throw new InvalidOperationException("Tenant not found.");
                        }

                        entry.Entity.Tenant = tenant;
                        break;
                }
            }
            var result = await base.SaveChangesAsync(cancellationToken);
            return result;
        }
    }
}
