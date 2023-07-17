using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectHistoryController : BaseController<ProjectHistory, ProjectHistoryRepository, int>
    {
        private readonly ProjectHistoryRepository projectHistoryRepository;
        public ProjectHistoryController(ProjectHistoryRepository projectHistoryRepository) : base(projectHistoryRepository)
        {
            this.projectHistoryRepository = projectHistoryRepository;
        }

        [HttpGet("accountId")]
        public async Task<IActionResult> GetProjectByAccountId(string accountId)
        {
            var get = await projectHistoryRepository.GetProjectByAccountId(accountId);
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
