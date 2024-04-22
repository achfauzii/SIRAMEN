
using Microsoft.AspNetCore.Mvc;
using System.Net;
using RasManagement.BaseController;
using RasManagement.Repository;
using Microsoft.AspNetCore.Authorization;
using RasManagement.Interface;

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

        [HttpPost("Interview")]
        public IActionResult Insert(TrackingInterview trackingInterview)
        {
            try
            {
                trackingInterview.CreatedAt = DateTime.UtcNow;
                int insertedId = trackingRepository.Insert(trackingInterview);
                // Return success response with inserted entity's Id
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Dimasukkan", Data = insertedId });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Gagal Memasukkan Data", error = ex.Message });
            }
        }

        [HttpPut("UpdateInterview")]
        public IActionResult Update(TrackingInterview trackingInterview)
        {
            try
            {
                var result = trackingRepository.Update(trackingInterview);
                if (result >= 1)
                {
                    return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Diperbaharui", Data = result });
                }
                else
                {
                    return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Gagal Memperbaharui Data", Data = result });
                }
            }
           catch(Exception ex)
            {
                return Ok(new { status = HttpStatusCode.NotFound, message = "Cannot add a tracking interview, the position field is null." });
            }
        }

    }
}
