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
    //[Authorize(Roles = "Admin")]
    public class MasterHolidayController : BaseController<MasterHoliday, MasterHolidayRepository, int>
    {
        private readonly MasterHolidayRepository masterHolidayRepository;
        public MasterHolidayController(MasterHolidayRepository masterHolidayRepository) : base(masterHolidayRepository)
        {
            this.masterHolidayRepository = masterHolidayRepository;
        }

        /*[HttpGet("accountId")]
        public async Task<IActionResult> GetHolidaysByAccountId(string accountId)
        {
            var get = await masterHolidayRepository.GetHolidaysByAccountId(accountId);
            if (get != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data not found", Data = get });
            }
        }*/

        [HttpGet("getHolidayByDate")]
        public IActionResult getHolidayByDate(DateTime date)
        {
            var get = masterHolidayRepository.getHolidayByDate(date);

            if (get.Count() == 0)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK});
            }
            return StatusCode(404, new { status = HttpStatusCode.NotFound , search = date});
        }
    }
}
