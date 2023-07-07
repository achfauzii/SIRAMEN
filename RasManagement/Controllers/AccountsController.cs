
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;
using RasManagement.Interface;
using RasManagement.Repository;
using RasManagement.ViewModel;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Reflection;
using System.Security.Claims;
using System.Text;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IUnitWork _unitWork;
        private readonly ProjectRasmanagementContext _context;
        private readonly AccountRepository accountRepository;
        private readonly IConfiguration _configuration;



        public AccountsController(IUnitWork unitWork, ProjectRasmanagementContext context, AccountRepository accountRepository, IConfiguration configuration)
        {
            _context = context;
            this.accountRepository = accountRepository;
            _unitWork = unitWork;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<List<Account>>> GetAccounts()
        {
            return Ok(await _context.Accounts.ToListAsync());
        }

        [HttpPost("Register")]
        public async Task<ActionResult> Register(RegisterVM registerVM)
        {
            bool emailExists =  await accountRepository.AccountIsExist(registerVM.Email, null);
            bool accountIdExists =await  accountRepository.AccountIsExist(null, registerVM.AccountId);


            if (string.IsNullOrWhiteSpace(registerVM.Email))
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Data Kosong atau Mengandung Spasi", Data = registerVM.Email });
            }
            else if(emailExists && accountIdExists)
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Account Already exist"});
            }
            else if ( accountIdExists)
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "AccountId Already exist." });
            }
            else if (emailExists)
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Email Already exist." });
            }

            await accountRepository.Register(registerVM);
            return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Di Tambahkan", Data = registerVM });
        }

        // Add Login POST api/<AccountController>
        [HttpPost]
        public IActionResult Post(VMLogin viewLogin)
        {
            var vMlogin = accountRepository.Login(viewLogin);
            switch (vMlogin)
            {
                case 1:
                    using (var _context = new ProjectRasmanagementContext())
                    {
                        var roleId = _context.Accounts.FirstOrDefault(a => a.Email == viewLogin.Email);
                        var roleName = GetRoleNamefromDatabase(roleId.RoleId.ToString());
                        Claim roleClaim = new Claim("Role", roleName);
                        var claims = new[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim("Email", viewLogin.Email),
                        new Claim("Password", viewLogin.Password),
                        new Claim("AccountId", roleId.AccountId),
                        new Claim("RoleId", roleId.RoleId),
                        

                        roleClaim
                    };
                        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                        var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                        var token = new JwtSecurityToken(
                            _configuration["Jwt:Issuer"],
                            _configuration["Jwt:Audience"],
                            claims,
                            expires: DateTime.UtcNow.AddHours(5),
                            signingCredentials: signIn);
                        var userToken = new JwtSecurityTokenHandler().WriteToken(token);
                        Console.WriteLine(userToken);
                        return StatusCode(200, new { status = HttpStatusCode.OK, message = "Login Successfully", Data = userToken });
                    }
                case 3:
                    return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Please cek your email", Data = vMlogin });
                case 4:
                    return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Please cek your password", Data = vMlogin });
                default:
                    return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "I'm sorry, something wrong", Data = vMlogin });
            }
        }
        private string GetRoleNamefromDatabase(string role_id)
        {
            using (var _context = new ProjectRasmanagementContext())
            {
                var role = _context.Roles.FirstOrDefault(role => role.RoleId == role_id);
                if (role != null)
                {
                    return role.Rolename.ToString();
                }
            }

            return string.Empty;
        }
    }

}
