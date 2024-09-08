using IndicaMais.DbContexts;
using IndicaMais.Models;
using IndicaMais.Services.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace IndicaMais.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Usuario> _userManager;
        private readonly SignInManager<Usuario> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ICurrentTenantService _currentTenantService;

        public string CurrentTenantId { get; set; }

        public UsuarioService(ApplicationDbContext context, UserManager<Usuario> userManager, SignInManager<Usuario> signInManager, RoleManager<IdentityRole> roleManager, ICurrentTenantService currentTenantService)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _currentTenantService = currentTenantService;
            CurrentTenantId = _currentTenantService.TenantId;
        }

        public async Task<UsuarioMin> Buscar()
        {
            var user = await _userManager.GetUserAsync(_signInManager.Context.User);

            if (user == null)
            {
                return null;
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault();

            return new UsuarioMin
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                IsRoot = user.IsRoot,
                Role = role
            };
        }

        public async Task<bool> Criar(CriarUsuarioRequest request)
        {
            if (request.Cargo != "Superadmin")
            {
                if (request.Senha == request.Confirmacao)
                {
                    var usuario = new Usuario
                    {
                        UserName = $"user_{CurrentTenantId}_{request.Email}",
                        Email = request.Email,
                        Name = request.Nome,
                        IsStaff = true
                    };

                    var result = await _userManager.CreateAsync(usuario, request.Senha);

                    if (result.Succeeded)
                    {
                        result = await _userManager.AddToRoleAsync(usuario, request.Cargo);

                        if (result.Succeeded)
                        {
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        public async Task<bool> CriarUsuarioRaiz(CriarUsuarioRaizRequest request)
        {
            if (request.Senha == request.Confirmacao && request.Senha.Length >= 6)
            {
                var usuario = new Usuario
                {
                    UserName = $"user_{CurrentTenantId}_{request.Email}",
                    Email = request.Email,
                    Name = request.Nome,
                    IsStaff = true
                };

                var result = await _userManager.CreateAsync(usuario, request.Senha);

                if (result.Succeeded)
                {
                    result = await _userManager.AddToRoleAsync(usuario, "Admin");

                    if (result.Succeeded)
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        public async Task<IEnumerable<UsuarioMin>> Listar()
        {
            var usuarios = await _userManager.Users
                .Where(u => u.IsStaff == true)
                .Select(u => new UsuarioMin
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    IsRoot = u.IsRoot,
                    Role = (from userRole in _context.UserRoles
                            join role in _context.Roles on userRole.RoleId equals role.Id
                            where userRole.UserId == u.Id
                            select role.Name).FirstOrDefault()
                })
                .OrderBy(u => u.Name)
                .ToListAsync();

            return usuarios;
        }

        public async Task<bool> Editar(string id, EditarUsuarioRequest request)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user != null)
            {
                if (!request.Nome.IsNullOrEmpty())
                {
                    user.Name = request.Nome;
                }

                if (!request.Email.IsNullOrEmpty() && request.Email != user.Email)
                {
                    await _userManager.SetEmailAsync(user, request.Email);
                    await _userManager.SetUserNameAsync(user, $"user_{CurrentTenantId}_{request.Email}");
                }

                if (!request.Senha.IsNullOrEmpty() && !request.Confirmacao.IsNullOrEmpty())
                {
                    if (request.Senha == request.Confirmacao)
                    {
                        await _userManager.RemovePasswordAsync(user);
                        await _userManager.AddPasswordAsync(user, request.Senha);
                    }
                }

                if (!request.Cargo.IsNullOrEmpty() && request.Cargo != "Superadmin" && user.IsRoot == false)
                {
                    var cargos = await _userManager.GetRolesAsync(user);
                    await _userManager.RemoveFromRolesAsync(user, cargos);
                    await _userManager.AddToRoleAsync(user, request.Cargo);
                }

                var result = await _userManager.UpdateAsync(user);
                return result.Succeeded;
            }

            return false;
        }

        public async Task<bool> Excluir(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            var usuarioLogado = await _userManager.GetUserAsync(_signInManager.Context.User);

            if (user != null && user.IsRoot == false)
            {
                var result = await _userManager.DeleteAsync(user);

                if (user == usuarioLogado && result.Succeeded)
                {
                    await _signInManager.SignOutAsync();
                }

                return result.Succeeded;
            }

            return false;
        }

        public async Task<bool> Autenticar(LoginUsuarioRequest request)
        {
            var result = await _signInManager.PasswordSignInAsync($"user_{CurrentTenantId}_{request.Email}", request.Senha, isPersistent: false, lockoutOnFailure: false);
            return result.Succeeded;
        }

        public async Task<bool> Validar()
        {
            var userIdentity = _signInManager.Context.User.Identity;

            if (userIdentity != null)
            {
                var user = await _userManager.GetUserAsync(_signInManager.Context.User);
                return (userIdentity.IsAuthenticated && user!.IsStaff);
            }
            else
            {
                return false;
            }
        }

        public async Task<string> Desconectar()
        {
            await _signInManager.SignOutAsync();
            return "Deslogado com sucesso";
        }

        public async Task<bool> CriarCargo(CriarCargoRequest request)
        {
            if (!await _roleManager.RoleExistsAsync(request.Nome))
            {
                await _roleManager.CreateAsync(new IdentityRole(request.Nome));
                return true;
            }

            return false;
        }

        public async Task<IEnumerable<string>> ListarCargos()
        {
            var cargos = await _roleManager.Roles
                .Where(c => c.Name != "Superadmin")
                .Select(c => c.Name)
                .ToListAsync();

            return cargos;
        }
    }
}
