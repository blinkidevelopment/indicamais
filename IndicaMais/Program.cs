using IndicaMais.DbContexts;
using IndicaMais.Middleware;
using IndicaMais.Models;
using IndicaMais.Services;
using IndicaMais.Services.Integrations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddCookie(options =>
    {
        options.Cookie.Name = "Authorization";
        options.Cookie.Expiration = TimeSpan.FromHours(1);
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidIssuer = Parametros.Issuer,
            ValidAudience = Parametros.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Parametros.SecurityKey!)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["Authorization"];
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", p =>
    {
        p.RequireClaim("admin", "True");
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseMySql(Parametros.CodConexao, ServerVersion.AutoDetect(Parametros.CodConexao)));
builder.Services.AddDbContext<TenantDbContext>(
    options => options.UseMySql(Parametros.CodConexao, ServerVersion.AutoDetect(Parametros.CodConexao)));

builder.Services.AddIdentity<Usuario, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.Password.RequiredUniqueChars = 1;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();
builder.Services.AddAuthorization();

builder.Services.AddTransient<IParceiroService, ParceiroService>();
builder.Services.AddTransient<IEmpresaService, EmpresaService>();
builder.Services.AddTransient<IEmpresaService, EmpresaService>();
builder.Services.AddTransient<IPremioService, PremioService>();
builder.Services.AddTransient<ITransacaoService, TransacaoService>();
builder.Services.AddTransient<IUsuarioService, UsuarioService>();
builder.Services.AddTransient<IProcessoService, ProcessoService>();
builder.Services.AddScoped<ICurrentTenantService, CurrentTenantService>();

builder.Services.AddControllersWithViews();

builder.Services.AddSession(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
});

builder.Services.AddHttpClient<AsaasService>();
builder.Services.AddHttpClient<ViosService>();

var app = builder.Build();

app.UseMiddleware<TenantResolver>();
app.UseSession();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
