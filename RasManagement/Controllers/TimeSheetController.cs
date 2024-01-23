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
            if (end.Subtract(start).Days > 41){
            var get = await timeSheetRepository.GetTimeSheetsByMonth(start, end);
           
            var groupedByDay = get.GroupBy(a => a.Date);
            var resultWithTitles = new List<object>();
            foreach (var dayGroup in groupedByDay)
            {
            var countFlag = dayGroup
                .GroupBy(a => a.Flag)
                .Select(flagGroup => new
                {
                    title = flagGroup.Key + ": " + flagGroup.Count(),
                    start = dayGroup.Key,
                    allDay = true,
                    backgroundColor = GetColorByFlag(flagGroup.Key),
                    borderColor = GetColorByFlag(flagGroup.Key),
                })
                .ToList();
            resultWithTitles.AddRange(countFlag);
            }
           return StatusCode(200, resultWithTitles );
            } else{
                var get = await timeSheetRepository.GetTimeSheetsByMonth(start, end);
                var groupedByDay = get.GroupBy(a => a.Date);
                var resultWithTitles = new List<object>();
                foreach (var dayGroup in groupedByDay)
                {
                var accountIds  = dayGroup
                .Select(item => new 
                {
                    title = item.AccountId +" "+ item.Activity,
                    start = dayGroup.Key,
                    allDay = true,
                    backgroundColor = GetColorByFlag(item.Flag),
                    borderColor = GetColorByFlag(item.Flag),
                })
                .ToList();;

                 
                
            resultWithTitles.AddRange(accountIds);
            }
            return StatusCode(200, resultWithTitles );
            }

        }
        private string GetColorByFlag(string flag)
        {
            switch (flag)
            {
                case "WFO":
                    return "#0073b7"; // Blue
                case "WFH":
                    return "#f39c12"; // Yellow
                case "WFC":
                    return "#00a65a"; // Green
                case "Sakit":
                    return "#6c757d"; // Grey
                case "Cuti":
                    return "#6c757d"; // Grey
                default:
                    return "#f56954"; // Red
            }
        }
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
