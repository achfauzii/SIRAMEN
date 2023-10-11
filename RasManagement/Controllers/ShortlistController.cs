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

            // Implementasi pencarian
            if (!string.IsNullOrEmpty(request.Search?.Value))
            {
                var searchTerm = request.Search.Value.ToLower();
                query = query.Where(e =>
                    e.Fullname.ToLower().Contains(searchTerm) || // Ganti dengan kolom yang ingin Anda cari
                    e.Position.ToLower().Contains(searchTerm) 
                );
            }



            // Filter, sort, dan paging data berdasarkan permintaan dari DataTables
            // Anda perlu mengimplementasikan logika ini sesuai dengan permintaan DataTables
            // Contoh: products = products.Where(...).OrderBy(...).Skip(...).Take(...);
            var shortList = await query.ToListAsync();
            // Menambahkan nomor urut pada setiap baris

            var response = new DataTablesResponse
            {
                Draw = request.Draw,
                RecordsTotal = shortList.Count(),
                RecordsFiltered = shortList.Count(), // Anda perlu mengganti ini dengan jumlah data yang sesuai setelah diterapkan filter
                Data = shortList// Data hasil filter dan paging
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

    }
}
