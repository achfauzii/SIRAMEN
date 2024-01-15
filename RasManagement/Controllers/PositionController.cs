using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PositionController : BaseController<Position, PositionRepository, int>
    {
        private readonly PositionRepository positionRepository;
        public PositionController(PositionRepository positionRepository) : base(positionRepository)
        {
            this.positionRepository = positionRepository;
        }


        [HttpGet("ByClientId")]
        public async Task<IActionResult> GetPositionbyClientId(int clientId)
        {
            var get = await positionRepository.GetPositionByClientId(clientId);
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
