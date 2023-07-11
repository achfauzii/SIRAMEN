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
    public class ProjectHistoryControler : BaseController<ProjectHistory, ProjectHistoryRepository, int>
    {
        private readonly ProjectHistoryRepository projectHistoryRepository;
        public ProjectHistoryControler(ProjectHistoryRepository projectHistoryRepository) : base(projectHistoryRepository)
        {
            this.projectHistoryRepository = projectHistoryRepository;
        }

        [HttpGet("accountId")]
        public async Task<IActionResult> GetProjectHistoryByAccountId(string accountId)
        {
            var get = await projectHistoryRepository.GetProjectHistoryByAccountId(accountId);
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
