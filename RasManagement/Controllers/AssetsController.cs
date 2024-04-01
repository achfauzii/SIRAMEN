using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Models;
using RasManagement.Repository;
using System.IdentityModel.Tokens.Jwt;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[EnableCors("AllowOrigin")]
    [Authorize(Roles = "Employee,Admin,Super_Admin,Sales,Manager,Trainer")]

    public class AssetsController : ControllerBase
    {
        private readonly AssetsRepository assetsRepository;
        public AssetsController(AssetsRepository assetsRepository)
        {
            this.assetsRepository = assetsRepository;
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


        [HttpGet("accountId")]
        public async Task<IActionResult> GetAssetsByAccountId(string accountId)
        {
            var isAdmin = User.IsInRole("Admin");
            var isTrainer = User.IsInRole("Trainer");
            var isManager = User.IsInRole("Manager");
            var isSales = User.IsInRole("Sales");
            var isSA = User.IsInRole("Super_Admin");
            if (!isAdmin && !isTrainer && !isSA && !isSales && !isManager)
            {
                var accountId_ = GetAccountIdFromToken(); // Pastikan Anda sudah memiliki metode GetAccountIdFromToken() yang sesuai

                if (accountId_ != accountId)
                {
                    return StatusCode(403, new { status = HttpStatusCode.Forbidden, message = "You are not authorized to insert data for this account" });
                }
            }
            var get = await assetsRepository.GetAssetsByAccountId(accountId);
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
        public async Task<IActionResult> InsertAsset(AssetsManagement assetsManagement)
        {
            var isAdmin = User.IsInRole("Admin");
            var isTrainer = User.IsInRole("Trainer");
            var isManager = User.IsInRole("Manager");
            var isSales = User.IsInRole("Sales");
            var isSA = User.IsInRole("Super_Admin");
            if (!isAdmin && !isTrainer && !isSA && !isSales && !isManager)
            {
                var accountId = GetAccountIdFromToken(); // Pastikan Anda sudah memiliki metode GetAccountIdFromToken() yang sesuai
     
                if (accountId != assetsManagement.AccountId)
                {
                    return StatusCode(403, new { status = HttpStatusCode.Forbidden, message = "You are not authorized to insert data for this account" });
                
                }
            }
          
            var insert = await assetsRepository.InsertAssets(assetsManagement);
            if (insert >= 1)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Di Tambahkan", Data = insert });
            }
            else
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest});
            }
        }

        [HttpPut("Update")]
        public async Task<IActionResult> UpdateAsset(AssetsManagement updatedAsset)
        {
            var isAdmin = User.IsInRole("Admin");
            var isTrainer = User.IsInRole("Trainer");
            var isManager = User.IsInRole("Manager");
            var isSales = User.IsInRole("Sales");
            var isSA = User.IsInRole("Super_Admin");
            if (!isAdmin && !isTrainer && !isSA && !isSales && !isManager)
            {
                var accountId = GetAccountIdFromToken(); // Pastikan Anda sudah memiliki metode GetAccountIdFromToken() yang sesuai

                if (accountId != updatedAsset.AccountId)
                {
                    return StatusCode(403, new { status = HttpStatusCode.Forbidden, message = "You are not authorized to insert data for this account" });
                }
            }
            var update = await assetsRepository.UpdateAsset(updatedAsset);
            if (update >= 1)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Diperbarui", Data = update });
            }
            else
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteEducation(int assetId)
        {
            var success = await assetsRepository.DeleteAsset(assetId);
            if (success)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil dihapus" });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data tidak ditemukan atau gagal dihapus" });
            }
        }


        [HttpGet("{assetId}")]
        public async Task<IActionResult> GetByFormalEduId(int assetId)
        {
            var asset = await assetsRepository.GetByAssetId(assetId);
            if (asset != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = asset });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data not found" });
            }
        }
    }
}