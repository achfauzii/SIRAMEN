using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Employee,Admin,Super_Admin,Sales,Manager,Trainer")]
    public class QualificationController : BaseController<Qualification,QualificationRepository,int>
    {
        private readonly QualificationRepository qualificationRepository;
        public QualificationController(QualificationRepository qualificationRepository) : base(qualificationRepository)
        {
            this.qualificationRepository = qualificationRepository;
        }

        [AllowAnonymous]
        [HttpGet("accountId")]
        public async Task<IActionResult> GetQualificationByAccountId(string accountId)
        {
            var get = await qualificationRepository.GetQualificationByAccountId(accountId);
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
