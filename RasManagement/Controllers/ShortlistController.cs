using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Interface;
using RasManagement.Repository;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Super_Admin")]
    public class ShortlistController : BaseController<NonRasCandidate, ShortlistRepository, int>
    {
        private readonly ShortlistRepository shortlistRepository;
        private readonly ProjectRasmanagementContext _context;
        public ShortlistController(ShortlistRepository shortlistRepository, ProjectRasmanagementContext context) : base(shortlistRepository)
        {
            this.shortlistRepository = shortlistRepository;
            _context = context;
        }


        /*     [HttpPut("UpdateNonRAS")]
             public IActionResult UpdateNonRAS(NonRasCandidate nonRasCandidate)
             {
                 var get = shortlistRepository.UpdateNonRAS(nonRasCandidate);
                 if (get != null)
                 {
                     return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil diubah", Data = get });
                 }
                 else
                 {
                     return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data tidak bisa diubah", Data = get });
                 }
             }*/

        [HttpPost("NonRasDatatable")]
        public async Task<IActionResult> GetData([FromBody] DataTablesRequest request)
        {
            //var employees = await employeeRepository.GetEmployeeData();
            var query = _context.NonRasCandidates.AsQueryable();
            // Filter berdasarkan kategori (Category)



            // Implementasi pencarian
            if (!string.IsNullOrEmpty(request.Search?.Value))
            {
                var searchTerm = request.Search.Value.ToLower();
                query = query.Where(e =>
                    e.Fullname.ToLower().Contains(searchTerm) || // Ganti dengan kolom yang ingin dicari 
                    e.Position.ToLower().Contains(searchTerm)
                );
            }



            var shortList = await query.ToListAsync();

            var displayResult = shortList.Skip(request.Start)
                .Take(request.Length).ToList();

            var response = new DataTablesResponse
            {
                Draw = request.Draw,
                RecordsTotal = shortList.Count(),
                RecordsFiltered = shortList.Count(), // Count total
                Data = displayResult// Data hasil 
            };

            return Ok(response);
        }

        [HttpPost("Add")]
        public virtual ActionResult Add(NonRasCandidate nonRasCandidate)
        {
            var insert = shortlistRepository.Add(nonRasCandidate);
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
        }

        [AllowAnonymous]
        [HttpPost("ShortListCandidate")]
        public async Task<IActionResult> GetDataShared([FromBody] DataTablesRequest request)
        {
            //var employees = await employeeRepository.GetEmployeeData();
            var query = _context.NonRasCandidates.AsQueryable();
            // Filter berdasarkan kategori (Category)



            // Implementasi pencarian
            if (!string.IsNullOrEmpty(request.Search?.Value))
            {
                var searchTerm = request.Search.Value.ToLower();
                query = query.Where(e =>
                    e.Fullname.ToLower().Contains(searchTerm) || // Ganti dengan kolom yang ingin dicari 
                    e.Position.ToLower().Contains(searchTerm)
                );
            }



            var shortList = await query.ToListAsync();
            var displayResult = shortList.Skip(request.Start)
                .Take(request.Length)
                .Select(e => new
                {
                   
                    e.Fullname,
                    e.Position,
                    e.Skillset,
                    e.Education,
                    e.University,
                    e.Domisili,
                    e.Birthdate,
                    e.Level,
                    e.ExperienceInYear,
                    e.WorkStatus,
                    e.NoticePeriode,
                    e.FinancialIndustry,
                    e.CvBerca,
                    e.LevelRekom
                    
                    
                })
                .ToList();

            var response = new DataTablesResponse
            {
                Draw = request.Draw,
                RecordsTotal = shortList.Count(),
                RecordsFiltered = shortList.Count(), // Count total
                Data = displayResult// Data hasil 
            };

            return Ok(response);
        }

    }
}
