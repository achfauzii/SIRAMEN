using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using RasManagement.BaseController;
using RasManagement.Repository;
using System.Globalization;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Employee,Admin,Manager, Trainer")]
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

        [AllowAnonymous]
        [HttpGet("activity")]
        public async Task<IActionResult> GetTimeSheetActivity(string accountId, DateTime date)
        {
            var get = await timeSheetRepository.GetTimeSheetsActivity(accountId, date);
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
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data not found", Data = get });
            }
        }

        [HttpGet("TimeSheetByMonth")]
        public async Task<IActionResult> GetTimeSheetByMonth([FromQuery] DateTime start, [FromQuery] DateTime end)
        {

            var get = await timeSheetRepository.GetTimeSheetsByMonth(start, end);
            return StatusCode(200, get);


        }

        [HttpPost("AddTimeSheet")]
        public IActionResult AddTimeSheet([FromBody] TimeSheet timeSheet)
        {
            try
            {
                if (timeSheetRepository.IsDateUnique(timeSheet.AccountId, timeSheet.Date))
                {
                    /* if( timeSheet.PlacementStatusId==0 || timeSheet.PlacementStatus == null)
                     {
                         return BadRequest(new { status = HttpStatusCode.BadRequest, message = "Tanggal sudah digunakan untuk TimeSheet lain." });
                     }*/
                    int addTimeSheetResult = timeSheetRepository.AddTimeSheet(timeSheet);

                    // If the operation is successful, return a 200 OK response
                    return Ok(new { status = HttpStatusCode.OK, message = "Data Berhasil Ditambahkan", Data = addTimeSheetResult });
                }
                else
                {
                    // Handle the case where the date is not unique
                    return Ok(new { status = HttpStatusCode.BadRequest, message = "Time Sheet with the same date already exists!" });
                }
            }
            catch (Exception ex)
            {
                return Ok(new { status = HttpStatusCode.NotFound, message = "Cannot add a timesheet, the placement field is null." });
            }

        }

        /*[HttpGet("ByCurrentMonth")]
        public async Task<IActionResult> GetTimeSheetsByAccountAndCurrentMonth(string accountId)
        {
            try
            {
                var timeSheets = await timeSheetRepository.GetCurrentMonth(accountId);
                return Ok(timeSheets);
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Terjadi Kesalahan", Data = ex.Message });
            }
        }*/


    }

}
