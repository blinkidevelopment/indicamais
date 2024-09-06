using IndicaMais.Services;

namespace IndicaMais.Middleware
{
    public class TenantResolver
    {
        private readonly RequestDelegate _next;

        public TenantResolver(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ICurrentTenantService currentTenantService)
        {
            var host = context.Request.Host.Value;
            if (!string.IsNullOrEmpty(host))
            {
                var subdomain = host.Split('.')[0];
                await currentTenantService.SetTenant(subdomain);
            }
            
            await _next(context);
        }
    }
}
