
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Cors;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Identity.Client;
//using RasManagement.BaseController;
//using RasManagement.Models;
//using RasManagement.Repository;
//using RasManagement.ViewModel;
//using System.Data;
//using System.IdentityModel.Tokens.Jwt;
//using System.Net;

//namespace RasManagement.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    [Authorize(Roles = "Employee,Admin,Super_Admin,Sales,Manager,Trainer")]
//    public class NonFormalEduController : ControllerBase
//    {
//        private readonly NonFormalEduRepository nonFormalEduRepository;
//        //public NonFormalEduController(NonFormalEduRepository nonFormalEduRepository) : base(nonFormalEduRepository)
//        public NonFormalEduController(EducationRepository educationRepository)
//        {
//            this.nonFormalEduRepository = nonFormalEduRepository;
//        }

//        private string GetAccountIdFromToken()
//        {
//            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
//            var handler = new JwtSecurityTokenHandler();
//            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

//            if (jsonToken == null)
//            {
//                throw new ArgumentException("Invalid JWT token");
//            }

//            var accountId = jsonToken.Claims.FirstOrDefault(claim => claim.Type == "AccountId")?.Value;

//            if (accountId == null)
//            {
//                throw new ArgumentException("Claim not found in token");
//            }

//            return accountId;
//        }

//        //[AllowAnonymous]
//        [HttpGet("accountId")]
//        public async Task<IActionResult> GetByAccountId(string accountId)
//        {
//            var isAdmin = User.IsInRole("Admin");
//            var isTrainer = User.IsInRole("Trainer");
//            var isManager = User.IsInRole("Manager");
//            var isSales = User.IsInRole("Sales");
//            var isSA = User.IsInRole("Super_Admin");
//            if (!isAdmin && !isTrainer && !isSA && !isSales && !isManager)
//            {
//                var accountId_ = GetAccountIdFromToken(); // Pastikan Anda sudah memiliki metode GetAccountIdFromToken() yang sesuai

//                if (accountId_ != accountId)
//                {
//                    return StatusCode(403, new { status = HttpStatusCode.Forbidden, message = "You are not authorized to insert data for this account" });
//                }
//            }
//            var get = await nonFormalEduRepository.GetEducationByAccountId(accountId);
//            if (get != null)
//            {
//                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = get });
//            }
//            else
//            {
//                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data not found", Data = get });
//            }
//        }

//        [HttpGet]
//        public async Task<IActionResult> GetAllNonFormalEducations()
//        {
//            var nonEducations = await nonFormalEduRepository.Get();
//            if (nonEducations != null && nonEducations.Any())
//            {
//                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = nonEducations });
//            }
//            else
//            {
//                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data not found", Data = nonEducations });
//            }
//        }

//        [HttpGet("{nonFormalEduId}")]
//        public async Task<IActionResult> GetByFormalEduId(int nonFormalEduId)
//        {
//            var formalEdu = await nonFormalEduRepository.GetByNonFormalEduId(nonFormalEduId);
//            if (formalEdu != null)
//            {
//                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = formalEdu });
//            }
//            else
//            {
//                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data not found" });
//            }
//        }

//        [HttpPost]
//        public async Task<IActionResult> InsertAsset(NonFormalEdu edu)
//        {
//            var isAdmin = User.IsInRole("Admin");
//            var isTrainer = User.IsInRole("Trainer");
//            var isManager = User.IsInRole("Manager");
//            var isSales = User.IsInRole("Sales");
//            var isSA = User.IsInRole("Super_Admin");
//            if (!isAdmin && !isTrainer && !isSA && !isSales && !isManager)
//            {
//                var accountId_ = GetAccountIdFromToken(); // Pastikan Anda sudah memiliki metode GetAccountIdFromToken() yang sesuai

//                if (accountId_ != edu.AccountId)
//                {
//                    return StatusCode(403, new { status = HttpStatusCode.Forbidden, message = "You are not authorized to insert data for this account" });
//                }
//            }

//            var insert = await nonFormalEduRepository.InsertNonFormalEducation(edu);
//            if (insert >= 1)
//            {
//                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Di Tambahkan", Data = insert });
//            }
//            else
//            {
//                return StatusCode(400, new { status = HttpStatusCode.BadRequest });
//            }
//        }

//        [HttpPut("Update")]
//        public async Task<IActionResult> UpdateEducation(NonFormalEdu edu)
//        {
//            var isAdmin = User.IsInRole("Admin");
//            var isTrainer = User.IsInRole("Trainer");
//            var isManager = User.IsInRole("Manager");
//            var isSales = User.IsInRole("Sales");
//            var isSA = User.IsInRole("Super_Admin");
//            if (!isAdmin && !isTrainer && !isSA && !isSales && !isManager)
//            {
//                var accountId_ = GetAccountIdFromToken(); // Pastikan Anda sudah memiliki metode GetAccountIdFromToken() yang sesuai

//                if (accountId_ != edu.AccountId)
//                {
//                    return StatusCode(403, new { status = HttpStatusCode.Forbidden, message = "You are not authorized to insert data for this account" });
//                }
//            }
//            var update = await nonFormalEduRepository.UpdateNonFormalEducation(edu);
//            if (update >= 1)
//            {
//                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Diperbarui", Data = update });
//            }
//            else
//            {
//                return StatusCode(400, new { status = HttpStatusCode.BadRequest });
//            }
//        }

//        [HttpDelete("{educationId}")]
//        public async Task<IActionResult> DeleteEducation(int educationId)
//        {

//            var success = await nonFormalEduRepository.DeleteNonFormalEducation(educationId);
//            if (success)
//            {
//                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil dihapus" });
//            }
//            else
//            {
//                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data tidak ditemukan atau gagal dihapus" });
//            }
//        }



//    }
//}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Models;
using RasManagement.Repository;
using RasManagement.ViewModel;
using System.Data;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Employee,Admin,Super_Admin,Sales,Manager,Trainer")]
    public class NonFormalEduController : BaseController<NonFormalEdu, NonFormalEduRepository, int>
    {
        private readonly NonFormalEduRepository nonFormalEduRepository;
        public NonFormalEduController(NonFormalEduRepository nonFormalEduRepository) : base(nonFormalEduRepository)
        {
            this.nonFormalEduRepository = nonFormalEduRepository;
        }

        //[AllowAnonymous]
        [HttpGet("accountId")]
        public async Task<IActionResult> GetByAccountId(string accountId)
        {
            var get = await nonFormalEduRepository.GetEducationByAccountId(accountId);
            if (get != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data not found", Data = get });
            }
        }

    }
}
