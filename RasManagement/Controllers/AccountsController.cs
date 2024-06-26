﻿
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
using RasManagement.Services;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Microsoft.AspNetCore.Authorization;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Employee,Admin,Super_Admin,Trainer,Sales,Manager")]
    public class AccountsController : ControllerBase
    {
        private readonly IUnitWork _unitWork;
        private readonly ProjectRasmanagementContext _context;
        private readonly AccountRepository accountRepository;
        private readonly IConfiguration _configuration;
        //private readonly EmailService _emailService;
        private readonly IMailService mailService;

        public AccountsController(IUnitWork unitWork, ProjectRasmanagementContext context, AccountRepository accountRepository, IConfiguration configuration, /*IEmailService emailService*/ IMailService mailService)
        {
            _context = context;
            this.accountRepository = accountRepository;
            _unitWork = unitWork;
            _configuration = configuration;
            //_emailService = emailService;
            this.mailService = mailService;
        }


        [Authorize(Roles = "Admin,Super_Admin,Trainer,Sales,Manager")]
        [HttpGet]
        public async Task<ActionResult<List<AccountVM>>> GetAccountsAsync()
        {
            return Ok(await _context.Accounts.ToListAsync());
        }


        // Untuk Register
        [Authorize(Roles = "Admin,Super_Admin,Trainer,Sales,Manager")]
        [HttpPost("Register")]
        public async Task<ActionResult> Register(RegisterVM registerVM)
        {
            bool emailExists = await accountRepository.AccountIsExist(registerVM.Email, null);
            bool accountIdExists = await accountRepository.AccountIsExist(null, registerVM.AccountId);
            bool nikExist = accountRepository.CheckNIK(registerVM.NIK);

            if (string.IsNullOrWhiteSpace(registerVM.Email))
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Data Kosong atau Mengandung Spasi", Data = registerVM.Email });
            }
            else if (emailExists && accountIdExists)
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Account Already exist" });
            }
            else if (accountIdExists)
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "AccountId Already exist." });
            }
            else if (emailExists)
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Email Already exist." });
            }
            else if (nikExist)
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "NIK Already exist." });
            }

            var result = await accountRepository.Register(registerVM);
            return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Di Tambahkan", Data = result });
        }

        // Untuk Login
        [HttpPost]
        [AllowAnonymous]
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
                        Claim roleClaim = new Claim(ClaimTypes.Role, roleName);
                        var claims = new[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim("Email", viewLogin.Email),
                        new Claim("Password", ""),
                        new Claim("AccountId", roleId.AccountId),
                        new Claim("RoleId", roleId.RoleId),
                        new Claim("Name", roleId.Fullname),

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

                        return StatusCode(200, new { status = HttpStatusCode.OK, message = "Login Successfully", Data = userToken });
                    }
                case 3:
                    return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Please cek your email", Data = vMlogin });
                case 4:
                    return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Please cek your password", Data = vMlogin });
                case 5:
                    return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Account Suspended", Data = vMlogin });
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

 
        // Funtion unutk generate Reset PasswordToken Retutnya adalah sebuah token
        private async Task<string> GeneratePasswordResetToken(string email)
        {

            using (var _context = new ProjectRasmanagementContext())
            {
                var _account = _context.Accounts.FirstOrDefault(a => a.Email == email);


                var claims = new[]
            {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        //new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        //new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim("Email", _account.Email),

                    };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                /*    _configuration["Jwt:Issuer"],
                    _configuration["Jwt:Audience"],*/
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(15),
                    signingCredentials: signIn);
                var resetToken = new JwtSecurityTokenHandler().WriteToken(token);

                return resetToken;
            }
        }

        // API untuk melakukan lupa passwordnya returnnya adalah Token
        [HttpPost("ForgotPassword")]
        [AllowAnonymous]
        public async Task<IActionResult> SendMail(/*[FromForm] MailRequest request*/ string email)
        {
            bool emailExists = await accountRepository.AccountIsExist(email, null);
            if (emailExists == false)
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Email Address Not Found" });
            }
            // Generate a password reset token
            try
            {
                string resetToken = await GeneratePasswordResetToken(email);
                //string resetUrl = $"https://example.com/resetpassword?token={resetToken}";
                //await mailService.SendEmailAsync(email, resetUrl);
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Email Found", Data = resetToken });
            }
            catch (Exception ex)
            {
                throw;
            }

        }



    
        [HttpPut("UpdatePassword")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdatePassword(UpdatePasswordVM updatePassword)
        {
            var email = updatePassword.Email;

            try
            {
                // Mendapatkan pengguna berdasarkan email
                var user = await accountRepository.GetByEmail(email);
                if (user == null)
                {
                    return StatusCode(404, new { status = HttpStatusCode.BadRequest, message = "Email Address Not Found" });
                }


                // Update password
                var _updatePassword = await accountRepository.UpdatePassword(updatePassword);

                if (_updatePassword == true)
                {
                    return StatusCode(200, new { status = HttpStatusCode.OK, message = "Password reset successfully." });

                }
                else
                {
                    return BadRequest("Password reset failed");
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPut("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePassVM changePassVM)
        {
            var email = changePassVM.Email;

            try
            {
                // Mendapatkan pengguna berdasarkan email
                var user = await accountRepository.GetByEmail(email);
                if (user == null)
                {
                    return StatusCode(404, new { status = HttpStatusCode.BadRequest, message = "Email Address Not Found" });
                }


                // Update password
                var _updatePassword = await accountRepository.ChangePassword(changePassVM);

                if (_updatePassword == true)
                {
                    return StatusCode(200, new { status = HttpStatusCode.OK, message = "Password reset successfully." });

                }
                else
                {
                    return BadRequest("Password reset failed");
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPut("UpdateRole")]
        public IActionResult UpdateRoles(RoleVM roleVM)
        {
            var get = accountRepository.UpdateRole(roleVM);
            if (get != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil diubah", Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data tidak bisa diubah", Data = get });
            }
        }

        [HttpPut("UpdateNIK")]
        public IActionResult UpdateNIK(NikVM nikVM)
        {
            var get = accountRepository.UpdateNIK(nikVM);
            if (get != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil diubah", Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data tidak bisa diubah", Data = get });
            }
        }

        [HttpPut("UpdateContract")]
        public IActionResult UpdateContracts(ContractVM contractVM)
        {
            var get = accountRepository.UpdateContract(contractVM);
            if (get != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil diubah", Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data tidak bisa diubah", Data = get });
            }
        }

        [HttpPut("UpdateTurnOver")]
        public async Task<IActionResult> UpdateTurnOver(TurnOverVM turnOverVM)
        {
            var get = await accountRepository.UpdateTurnOver(turnOverVM);

            if (get >= 1)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil di perbarui", Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data gagal di perbaharui" });
            }
        }

        [HttpGet("AccountId")]
        public IActionResult GetAccountId(string accountId)
        {
            var get = accountRepository.GetAccountId(accountId);
            if (get != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil ditemukan", Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data tidak dapat ditemukan", Data = get });
            }
        }

        [HttpGet("BirthDay")]
        [AllowAnonymous]
        public IActionResult GetBirthDay()
        {
            var account = _context.Accounts.ToList();
            List<String> birthday = new List<String>();
            List<String> email = new List<String>();

            foreach (var item in account)
            {
                if (item.Birthdate != null)
                {
                    if (item.Birthdate.Value.Date.ToString("MM-dd") == DateTime.Now.ToString("MM-dd"))
                    {
                        birthday.Add(item.Fullname);
                        email.Add(item.Email);
                    }
                }
            }

            if (email.Count > 0)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil ditemukan", Data = new { email = email, name = birthday } });
            }
            else
            {
                return StatusCode(200, new { status = HttpStatusCode.NotFound, message = "Data tidak dapat ditemukan", });
            }
        }

        [HttpDelete("Delete/{key}")]
        public IActionResult DeleteAccount(string key)
        {
            var delete = accountRepository.Delete(key);
            if (delete >= 1)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Dihapus", Data = delete });
            }
            else if (delete == 0)
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data dengan Id " + key + "Tidak Ditemukan", Data = delete });
            }
            else
            {
                return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Terjadi Kesalahan", Data = delete });
            }
        }


        //Filter Employee
        [HttpGet("FilteredEmp_ExceptSuperAdmin")]
        public IActionResult GetFilteredEmp()
        {
            var dataEmp = accountRepository.GetFilteredEmp();
            if (dataEmp != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil ditemukan", Data = dataEmp });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data tidak dapat ditemukan", Data = dataEmp });
            }
        }



    }

}