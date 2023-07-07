
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Models;
using RasManagement.Repository;
using RasManagement.ViewModel;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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

        /*[HttpPost]
        public ActionResult Insert(InsertNonFormalEdu insertNonFormalEdu)
        {
            var insert = nonFormalEdu_Repository.Insert(insertNonFormalEdu);
            if (insert >= 1)
            {
                return StatusCode(200,
                    new
                    {
                        status = HttpStatusCode.OK,
                        message = "Data Berhasil Dimasukkan",
                        Data = insert
                    });
            }
            else
            {
                return StatusCode(500,
                    new
                    {
                        status = HttpStatusCode.InternalServerError,
                        message = "Gagal Memasukkan Data",
                        Data = insert
                    });
            }
        }*/
    }
}