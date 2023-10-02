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

        /*[HttpPost("ShortListCandidate")]
        public IActionResult PostShortListCandidate([FromBody] NonRasCandidate candidate)
        {
            try
            {
                if (candidate.NonRasId == "")
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
        }*/


        /*[HttpPost("ShortListCandidate")]
        public IActionResult ShortListCandidate(List<List<NonRasCandidate>> candidates)
        {
            try
            {
                if (candidates == null || candidates.Count == 0)
                {
                    return BadRequest("Permintaan tidak berisi data JSON yang valid.");
                }

                foreach (var candidate in candidates)
                {
                    foreach (var candid in candidate)
                    {
                        if (string.IsNullOrEmpty(candid.NonRasId))
                        {
                            // Ini adalah operasi penambahan, karena NonRasId kosong.
                            candid.NonRasId = shortlistRepository.GenerateNonId();
                            _context.NonRasCandidates.Add(candid);
                        }
                        else
                        {
                            // Ini adalah operasi pembaruan, karena NonRasId sudah ada.
                            _context.NonRasCandidates.Update(candid);
                        }
                    }
                }
                //_context.NonRasCandidates.AddRange(candidate);
                _context.SaveChanges();
                return Ok("Data berhasil disimpan");
            }
            catch (Exception ex)
            {
                return BadRequest($"Gagal menyimpan data: {ex.Message}");
            }
        }*/

        [HttpPost("ShortListCandidate")]
      
        public IActionResult ShortListCandidate([FromBody] List<NonRasCandidate> candidates)
        {
            Console.WriteLine(candidates);
            try
            {
                if (candidates == null || candidates.Count == 0)
                {
                    return BadRequest("Permintaan tidak berisi data JSON yang valid.");
                }
                
                foreach (var candidate in candidates)
                {
                    if (string.IsNullOrEmpty(candidate.NonRasId))
                    {
                        // Ini adalah operasi penambahan, karena NonRasId baru.
                        //_context.Entry(candidate.NonRasId).State = EntityState.Detached;
                        _context.NonRasCandidates.Add(candidate);
                    }
                    else
                    {
                        // Ini adalah operasi pembaruan, karena NonRasId sudah ada.
                        //_context.Entry(candidate.NonRasId).State = EntityState.Detached;
                        _context.NonRasCandidates.Update(candidate);
                    }
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
