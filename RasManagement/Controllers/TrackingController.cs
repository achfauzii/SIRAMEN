
using Microsoft.AspNetCore.Mvc;
using System.Net;
using RasManagement.BaseController;
using RasManagement.Repository;
using Microsoft.AspNetCore.Authorization;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Employee,Admin,Super_Admin,Trainer,Sales,Manager")]
    public class TrackingController : BaseController<TrackingInterview, TrackingRepository, int>
    {
        private readonly TrackingRepository trackingRepository;
        public TrackingController(TrackingRepository trackingRepository) : base(trackingRepository)
        {
            this.trackingRepository = trackingRepository;
        }
        [HttpGet("Interview")]
        public async Task<IActionResult> GetTrackingInterview()
        {
            var get = trackingRepository.GetTrackingInterview();
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
