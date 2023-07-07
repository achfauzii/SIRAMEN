using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository.Data;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowOrigin")]
    public class EmploymentHistoryController : BaseController<EmploymentHistory, EmploymentHistoryRepository, int>
    {
        private readonly EmploymentHistoryRepository employmentHistoryRepository;
        public EmploymentHistoryController(EmploymentHistoryRepository employmentHistoryRepository) : base(employmentHistoryRepository)
        {
            this.employmentHistoryRepository = employmentHistoryRepository;
        }

        [HttpGet("accountId")]
        public async Task<IActionResult> GetEmploymentByAccountId(string accountId)
        {
            var get = await employmentHistoryRepository.GetEmploymentByAccountId(accountId);
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