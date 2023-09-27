using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShortlistController : BaseController<NonRasCandidate, ShortlistRepository, int>
    {
        private readonly ShortlistRepository shortlistRepository;
        private readonly ProjectRasmanagementContext _context;
        public ShortlistController(ShortlistRepository shortlistRepository, ProjectRasmanagementContext context) : base(shortlistRepository)
        {
            this.shortlistRepository = shortlistRepository;
            _context = context;
        }
        [HttpPost("ShortListCandidate")]
        public IActionResult ShortListCandidate([FromBody] NonRasCandidate candidate )
        {
            try
            {
                if (candidate.NonRasId =="")
                {
                    // Ini adalah operasi penambahan, karena EmployeeId baru.
                    _context.NonRasCandidates.Add(candidate);
             
                }
                else
                {
                    // Ini adalah operasi pembaruan, karena EmployeeId sudah ada.
                    _context.NonRasCandidates.Update(candidate);
                }

                _context.SaveChanges();
                return Ok("Data berhasil disimpan");
            }
            catch (Exception ex)
            {
                return BadRequest($"Gagal menyimpan data: {ex.Message}");
            }
        }
    }
}
