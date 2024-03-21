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
        [AllowAnonymous]
        [HttpGet("TimeSheetByMonth")]
        public async Task<IActionResult> GetTimeSheetByMonth([FromQuery] DateTime start, [FromQuery] DateTime end, [FromQuery] string? flag, [FromQuery] string? search, [FromQuery] string? categories, [FromQuery] string? status, [FromQuery] string? placement)
        {
            var get = await timeSheetRepository.GetTimeSheetsByMonth(start, end, flag, search, categories, status, placement);
            if (get != null)
            {
                return StatusCode(200, get);
            }
            else
            {
                return StatusCode(404, "data not found");
            }

        }

        [AllowAnonymous]
        [HttpGet("GetTimeSheetsByMonthDefault")]
        public async Task<IActionResult> GetTimeSheetsByMonthDefault([FromQuery] DateTime start, [FromQuery] DateTime end)
        {

            var get = await timeSheetRepository.GetTimeSheetsByMonthDefault(start, end);
            return StatusCode(200, get);


        }

        [AllowAnonymous]
        [HttpPost("AddTimeSheet")]
        public IActionResult AddTimeSheet([FromBody] TimeSheet timeSheet)
        {
            try
            {
                int addTimeSheetResult = timeSheetRepository.AddTimeSheet(timeSheet);
                if (addTimeSheetResult == 1)
                {
                    // If the operation is successful, return a 200 OK response
                    return Ok(new { status = HttpStatusCode.OK, message = "Data Berhasil Ditambahkan", Data = addTimeSheetResult });
                }
                else if (addTimeSheetResult == 400)
                {
                    // Handle the case where the date is not unique
                    return Ok(new { status = HttpStatusCode.BadRequest, message = "Flag with the same date can't be the same!" });
                    // return Ok(new { status = HttpStatusCode.BadRequest, message = "Time Sheet with the same date already exists!" });
                }
                else if (addTimeSheetResult == 406)
                {
                    // Handle the case where the date is not unique
                    return Ok(new { status = HttpStatusCode.NotAcceptable, message = "Can't add activities to sick or leave flags!" });
                    // return Ok(new { status = HttpStatusCode.BadRequest, message = "Time Sheet with the same date already exists!" });
                }
                else
                {
                    return Ok(new { status = HttpStatusCode.InternalServerError, message = "Failed to add data timesheet" });
                }
            }
            catch (Exception ex)
            {
                return Ok(new { status = HttpStatusCode.NotFound, message = "Cannot add a timesheet, the placement field is null." });
            }
        }

        [AllowAnonymous]
        [HttpPut("Update")]
        public IActionResult UpdateTimeSheet([FromBody] TimeSheet timeSheet)
        {
            try
            {
                int result = timeSheetRepository.UpdateTimeSheet(timeSheet);
                if (result != 304)
                {
                    // If the operation is successful, return a 200 OK response
                    return Ok(new { status = HttpStatusCode.OK, message = "Data Berhasil Diperbarui", Data = result });
                }
                else
                {
                    // Handle the case where the date is not unique
                    return Ok(new { status = HttpStatusCode.BadRequest, message = "Flag with the same date can't be the same!" });
                    // return Ok(new { status = HttpStatusCode.BadRequest, message = "Time Sheet with the same date already exists!" });
                }
            }
            catch (Exception ex)
            {
                return Ok(new { status = HttpStatusCode.NotFound, message = "Cannot add a timesheet, the placement field is null." });
            }

        }
        [AllowAnonymous]
        [HttpGet("GetTimeSheetByCompanyNameAndMonth")]
        public async Task<IActionResult> GetTimeSheetByCompanyNameAndMonth([FromQuery] string companyName, [FromQuery] string month)
        {
            // Menerjemahkan string bulan menjadi objek DateTime untuk memperoleh bulan yang sesuai
            DateTime targetDate;
            if (!DateTime.TryParseExact(month, "yyyy-MM", CultureInfo.InvariantCulture, DateTimeStyles.None, out targetDate))
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Month Not Valid" });
            }

            var get = await timeSheetRepository.GetTimeSheetByCompanyNameAndMonth(companyName, targetDate);
            if (get != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = get });
            }
            else
            {
                return StatusCode(200, new { status = HttpStatusCode.NotFound, message = "Data not found", Data = get });
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
                return Ok(new { status = HttpStatusCode.NotFound, message = "Cannot add a timesheet, the placement field is null." });
            }
        }*/

    }

}