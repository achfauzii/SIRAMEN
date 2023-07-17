using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[EnableCors("AllowOrigin")]
    public class CertificateController : BaseController<Certificate, CertificateRepository, int>
    {
        private readonly CertificateRepository certificateRepository;
        public CertificateController(CertificateRepository certificateRepository) : base(certificateRepository)
        {
            this.certificateRepository = certificateRepository;
        }

        [HttpGet("accountId")]
        public async Task<IActionResult> GetCertificateByAccountId(string accountId)
        {
            var get = await certificateRepository.GetCertificateByAccountId(accountId);
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