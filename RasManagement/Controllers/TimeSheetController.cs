using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;
using System.Globalization;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Employee,Admin")]
    public class TimeSheetController : BaseController<TimeSheet, TimeSheetRepository, int>
    {
        private readonly TimeSheetRepository timeSheetRepository;
        public TimeSheetController(TimeSheetRepository timeSheetRepository) : base(timeSheetRepository)
        {
            this.timeSheetRepository = timeSheetRepository;
        }

        [HttpGet("accountId")]
        public async Task<IActionResult> GetTimeSheetByAccountId(string accountId)
        {
            var get = await timeSheetRepository.GetTimeSheetsByAccount(accountId);
            if (get != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data not found", Data = get });
            }
        }

        [HttpGet("TimeSheetByAccountIdAndMonth")]
        public async Task<IActionResult> GetTimeSheetByAccountIdAndMonth([FromQuery] string accountId, [FromQuery] string month)
        {
            // Menerjemahkan string bulan menjadi objek DateTime untuk memperoleh bulan yang sesuai
            DateTime targetDate;
            if (!DateTime.TryParseExact(month, "yyyy-MM", CultureInfo.InvariantCulture, DateTimeStyles.None, out targetDate))
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Month Not Valid" });
            }

            var get = await timeSheetRepository.GetTimeSheetsByAccountIdAndMonth(accountId, targetDate);
            if (get != null && get.Any())
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
