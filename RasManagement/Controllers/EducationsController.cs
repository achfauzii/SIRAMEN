using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;
using System.IdentityModel.Tokens.Jwt;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[EnableCors("AllowOrigin")]
    [Authorize(Roles = "Employee,Admin,Super_Admin,Sales,Manager,Trainer")]
    //public class EducationsController : BaseController<FormalEdu, EducationRepository, int>
      public class EducationsController : ControllerBase
    {
        private readonly EducationRepository educationRepository;
        //public EducationsController(EducationRepository educationRepository) : base(educationRepository)
        public EducationsController(EducationRepository educationRepository)
        {
            this.educationRepository = educationRepository;
        }

        private string GetAccountIdFromToken()
        {
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

            if (jsonToken == null)
            {
                throw new ArgumentException("Invalid JWT token");
            }

            var accountId = jsonToken.Claims.FirstOrDefault(claim => claim.Type == "AccountId")?.Value;

            if (accountId == null)
            {
                throw new ArgumentException("Claim not found in token");
            }

            return accountId;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEducations()
        {
            var educations = await educationRepository.Get();
            if (educations != null && educations.Any())
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = educations });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data not found", Data = educations });
            }
        }
        [HttpGet("{formalEduId}")]
        public async Task<IActionResult> GetByFormalEduId(int formalEduId)
        {
            var formalEdu = await educationRepository.GetByFormalEduId(formalEduId);
            if (formalEdu != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = formalEdu });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data not found" });
            }
        }


        [HttpGet("accountId")]
        public async Task<IActionResult> GetEducationByAccountId(string accountId)
        {
            var isAdmin = User.IsInRole("Admin");
            var isTrainer = User.IsInRole("Admin");
            if (!isAdmin && !isTrainer)
            {
                var accountId_ = GetAccountIdFromToken(); // Pastikan Anda sudah memiliki metode GetAccountIdFromToken() yang sesuai

                if (accountId_ != accountId)
                {
                    return StatusCode(403, new { status = HttpStatusCode.Forbidden, message = "You are not authorized to insert data for this account" });
                }
            }
            var get = await educationRepository.GetEducationByAccountId(accountId);
            if (get != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data not found", Data = get });
            }
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> InsertAsset(FormalEdu edu)
        {
            var isAdmin = User.IsInRole("Admin");
            var isTrainer = User.IsInRole("Admin");
            if (!isAdmin && !isTrainer)
            {
                var accountId = GetAccountIdFromToken(); // Pastikan Anda sudah memiliki metode GetAccountIdFromToken() yang sesuai

                if (accountId != edu.AccountId)
                {
                    return StatusCode(403, new { status = HttpStatusCode.Forbidden, message = "You are not authorized to insert data for this account" });
                }
            }

            var insert = await educationRepository.InsertEducation(edu);
            if (insert >= 1)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Di Tambahkan", Data = insert });
            }
            else
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest });
            }
        }

        [HttpPut("Update")]
        public async Task<IActionResult> UpdateEducation(FormalEdu edu)
        {
            var isAdmin = User.IsInRole("Admin");
            var isTrainer = User.IsInRole("Admin");
            if (!isAdmin && !isTrainer)
            {
                var accountId = GetAccountIdFromToken(); // Pastikan Anda sudah memiliki metode GetAccountIdFromToken() yang sesuai

                if (accountId != edu.AccountId)
                {
                    return StatusCode(403, new { status = HttpStatusCode.Forbidden, message = "You are not authorized to insert data for this account" });
                }
            }
            var update = await educationRepository.UpdateEducation(edu);
            if (update >= 1)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Diperbarui", Data = update });
            }
            else
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest });
            }
        }

        [HttpDelete("{educationId}")]
        public async Task<IActionResult> DeleteEducation(int educationId)
        {
            var success = await educationRepository.DeleteEducation(educationId);
            if (success)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil dihapus" });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data tidak ditemukan atau gagal dihapus" });
            }
        }

    }
}