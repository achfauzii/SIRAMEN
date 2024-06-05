using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;
using System.Net;

namespace RasManagement.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Employee,Admin,Super_Admin,Sales,Manager,Trainer")]
    public class TurnOverController : BaseController<TurnOver, TurnOverRepository, int>
    {
        private readonly TurnOverRepository turnOverRepository;
        public TurnOverController(TurnOverRepository turnOverRepository) : base(turnOverRepository)
        {
            this.turnOverRepository = turnOverRepository;
        }

        [HttpGet("TurnOverEmployee")]
        public async Task<IActionResult> TurnOverEmployee()
        {
            var get = await turnOverRepository.GetTurnOverEmployee();
            if (get.Count() >= 0)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = get.Count() + " Data Ditemukan", TotalData = get.Count(), Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = get.Count() + " Data Ditemukan", Data = get });
            }
        }

        [HttpGet("GetHiredStatus")]
        public async Task<IActionResult> GetStatusHiredEmp()
        {
            var dataHiredStatus = await turnOverRepository.GetStatusHiredEmp();
            if (dataHiredStatus != null)
            {
                return StatusCode(200, new { 
                    status = HttpStatusCode.OK, 
                    message = "Data Ditemukan", 
                    Data = dataHiredStatus });
            }
            else
            {
                return StatusCode(404, new { 
                    status = HttpStatusCode.NotFound, 
                    message = "Not Found",
                    Data = dataHiredStatus });
            }
        }
    }

}
