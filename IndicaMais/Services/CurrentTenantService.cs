using Microsoft.EntityFrameworkCore;
using IndicaMais.DbContexts;

namespace IndicaMais.Services
{
    public class CurrentTenantService : ICurrentTenantService
    {
        private readonly TenantDbContext _context;

        public CurrentTenantService(TenantDbContext context)
        {
            _context = context;
        }

        public string? TenantId { get; set; }

        public async Task<bool> SetTenant(string tenant)
        {
            var tenantInfo = await _context.Tenants.Where(x => x.Id == tenant).FirstOrDefaultAsync();
            if (tenantInfo != null)
            {
                TenantId = tenantInfo.Id;
                return true;
            }
            else
            {
                throw new Exception("Tenant invalid");
            }
        }
    }
}
