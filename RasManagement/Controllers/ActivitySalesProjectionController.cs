using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Employee,Admin,Super_Admin,Sales,Manager,Trainer")]
    public class ActivitySalesProjectionController : BaseController<ActivitySalesProjection, ActivitySalesProjectionRepository, int>
    {
        private readonly ActivitySalesProjectionRepository activitySalesProjectionRepository;
        public ActivitySalesProjectionController(ActivitySalesProjectionRepository activitySalesProjectionRepository) : base(activitySalesProjectionRepository)
        {
            this.activitySalesProjectionRepository = activitySalesProjectionRepository; 
        }

        [HttpGet("bySpId")]
        public async Task<IActionResult> GetActivityBySpId(int id)
        {
            var get = await activitySalesProjectionRepository.GetBySpId(id);
            if (get.Count != 0)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = get });
            }
            else
            {
                return StatusCode(200, new { status = HttpStatusCode.NotFound, message = "Data not found", Data = get });
            }
        }
    }
}
