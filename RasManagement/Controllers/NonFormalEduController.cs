
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Models;
using RasManagement.Repository;
using RasManagement.ViewModel;
using System.Data;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Employee,Admin,Super_Admin")]
    public class NonFormalEduController : BaseController<NonFormalEdu, NonFormalEduRepository, int>
    {
        private readonly NonFormalEduRepository nonFormalEduRepository;
        public NonFormalEduController(NonFormalEduRepository nonFormalEduRepository) : base(nonFormalEduRepository)
        {
            this.nonFormalEduRepository = nonFormalEduRepository;
        }

        [HttpGet("accountId")]
        public async Task<IActionResult> GetByAccountId(string accountId)
        {
            var get = await nonFormalEduRepository.GetEducationByAccountId(accountId);
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