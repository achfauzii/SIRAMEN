using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[EnableCors("AllowOrigin")]
    [Authorize(Roles = "Employee,Admin,Super_Admin")]

    public class AssetsController : BaseController<AssetsManagement, AssetsRepository, int>
    {
        private readonly AssetsRepository assetsRepository;
        public AssetsController(AssetsRepository assetsRepository) : base(assetsRepository)
        {
            this.assetsRepository = assetsRepository;
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
    }
}