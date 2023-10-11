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
        public async Task<string> GenerateNonId()
        {
            //var currentDate = DateTime.Now.ToString("ddMMyyy");
            int countAccount = _context.Accounts.Count(account => account.RoleId == "5");
            /* var lastEmployee = myContext.Employees
                 .OrderByDescending(e => e.NIK)
                 .FirstOrDefault();*/
            var ras = "NonRAS";
            if (countAccount == 0)
            {
                // Jika belum ada data sama sekali, maka ID dimulai dari 0
                //return DateTime.Now.ToString("ddMMyyyy") + "000";
                return ras + "00";
            }
            return $"{ras}{countAccount.ToString("D3")}";
        }


        [HttpPut("UpdateNonRAS")]
        public IActionResult UpdateNonRAS(NonRasCandidate nonRasCandidate)
        {
            var get = accountRepository.UpdateRole(nonRasCandidate);
            if (get != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil diubah", Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data tidak bisa diubah", Data = get });
            }
        }
        /*       [HttpPost]
               public override ActionResult Insert(ShortlistRepository entity)
               {
                   // Panggil GenerateNonId untuk mendapatkan ID
                   string newId = GenerateNonId();

                   // Set ID yang dihasilkan ke properti ID dari entitas
                   entity.NonRasId = newId;

                   // Lakukan penambahan entitas ke database
                   var insert = repository.Insert(entity);

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
       */

        /*    [HttpPost("AddNewCandidate")]
            public async Task<ActionResult> AddNewCandidate(NonRasCandidate nonRasCandidate)
            {

               var data =  await shortlistRepository.AddNewCandidate(nonRasCandidate);
                if (data >= 1)
                {

                    return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil di tambahkan", Data = data });

                }
                else
                {
                    return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Placment gagal ditambahkan" });
                }

            }*/

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
        /*
                [HttpPost("ShortListCandidate")]

                public IActionResult ShortListCandidate([FromBody]List<List<object>> candidates)
                {

                    try
                    {
                        if (candidates == null || candidates.Count == 0)
                        {
                            return BadRequest("Permintaan tidak berisi data JSON yang valid.");
                        }

                        foreach (var candidate in candidates)
                        {
                            int row = Convert.ToInt32(candidate[0]);
                            int col = Convert.ToInt32(candidate[1]);
                            string newValue = candidate[2].ToString();

                            // Cari data di database berdasarkan row dan col
                            var existingRecord = _context.NonRasCandidates.FirstOrDefault(r => r.NonRasId == newValue);
                            if (existingRecord == null )
                            {
                                // Ini adalah operasi penambahan, karena NonRasId baru.

                                existingRecord.LastModified = DateTime.Now;
                                // Perbarui nilai yang sesuai di dalam database
                                //existingRecord. = newValue;
                                _context.SaveChanges();
                            }
                            else
                            {

                                existingRecord.LastModified = DateTime.Now;
                                // Perbarui nilai yang sesuai di dalam database
                                //existingRecord.Value = newValue;
                                _context.SaveChanges();
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
        */
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

		

	}
}
