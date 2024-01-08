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
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data not found", Data = get });
            }
        }

        /*[HttpPost("AddTimeSheet")]
        public IActionResult AddTimeSheet([FromBody] TimeSheet timeSheet)
        {
            var addTimeSheet = timeSheetRepository.AddTimeSheet(timeSheet);
            if (addTimeSheet >= 1)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Dihapus", Data = addTimeSheet });
            }
            else if (addTimeSheet == 0)
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, Data = addTimeSheet });
            }
            else
            {
                return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Terjadi Kesalahan", Data = addTimeSheet });
            }
        }
*/
        [HttpPost("AddTimeSheet")]
        public IActionResult AddTimeSheet([FromBody] TimeSheet timeSheet)
        {
            if (timeSheetRepository.IsDateUnique(timeSheet.AccountId, timeSheet.Date))
            {
                int addTimeSheetResult = timeSheetRepository.AddTimeSheet(timeSheet);

                // If the operation is successful, return a 200 OK response
                return Ok(new { status = HttpStatusCode.OK, message = "Data Berhasil Ditambahkan", Data = addTimeSheetResult });
            }
            else
            {
                // Handle the case where the date is not unique
                return BadRequest(new { status = HttpStatusCode.BadRequest, message = "Tanggal sudah digunakan untuk TimeSheet lain." });
            }
        }

        /*[HttpPost("AddTimeSheet")]
        public IActionResult AddTimeSheet([FromBody] TimeSheet timeSheet)
        {
            try
            {
                int addTimeSheetResult = timeSheetRepository.AddTimeSheet(timeSheet);

                // If the operation is successful, return a 200 OK response
                return Ok(new { status = HttpStatusCode.OK, message = "Data Berhasil Ditambahkan", Data = addTimeSheetResult });
            }
            catch (InvalidOperationException ex)
            {
                // Handle the specific exception when the date is not unique
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = ex.Message });
            }
            catch (Exception ex)
            {
                // Handle other unexpected exceptions
                return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Terjadi Kesalahan", Data = ex.Message });
            }
        }*/


    }

}
