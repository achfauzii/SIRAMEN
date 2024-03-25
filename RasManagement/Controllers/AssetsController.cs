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

    public class AssetsController : BaseController<AssetsManagement, AssetsRepository, int>
    {
        private readonly AssetsRepository assetsRepository;
        public AssetsController(AssetsRepository assetsRepository) : base(assetsRepository)
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
            var isTrainer = User.IsInRole("Admin");
            if (!isAdmin && !isTrainer)
            {
                var accountId = GetAccountIdFromToken(); // Pastikan Anda sudah memiliki metode GetAccountIdFromToken() yang sesuai
     
                if (accountId != assetsManagement.AccountId)
                {
                    return Forbid("You are not authorized to insert data for this account");
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
    }
}