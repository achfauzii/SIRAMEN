
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using RasManagement.Repository;
using RasManagement.ViewModel;
using System.Net;
using System.Reflection;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Employee,Admin,Super_Admin")]
    public class EmployeesController : ControllerBase
    {
        private readonly ProjectRasmanagementContext _context;
        private readonly EmployeeRepository employeeRepository;
        private readonly AccountRepository accountRepository;


        public EmployeesController(ProjectRasmanagementContext context, EmployeeRepository employeeRepository)
        {
            _context = context;
            this.employeeRepository = employeeRepository;
        }
        [HttpGet]
        public async Task<IActionResult> Employees()
        {
            var get = await employeeRepository.GetEmployeeData();
            if (get.Count() >= 0)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = get.Count() + " Data Ditemukan", TotalData = get.Count(), Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = get.Count() + " Data Ditemukan", Data = get });
            }
        }
        
        [HttpGet("EmployeeAdmin")]
        public async Task<IActionResult> GetAccountsEmployeeAdmin()
        {
            var get = await employeeRepository.GetAccountData();
         

            if (get.Count() != 0)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = get.Count() + " Data Ditemukan", TotalData = get.Count(), Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = get.Count() + " Data Ditemukan", Data = get });
            }
          }


        [HttpGet("TurnOff")]
        public async Task<IActionResult> TurnOff()
        {
            var get = await employeeRepository.GetTurnOff();

            if (get.Count() >= 0)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = get.Count() + " Data Ditemukan", TotalData = get.Count(), Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = get.Count() + " Data Ditemukan", Data = get });
            }
        }

        [HttpGet("accountId")]
        public IActionResult Employees(string accountId)
        {
            var get = employeeRepository.Get(accountId);
            if (get != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data not found", Data = get });
            }
        }

        [HttpPut("{accountId}")]
        public async Task<IActionResult> UpdateEmployee(string accountId,UpdateEmployeeVM updatedData)
        {
            var result = await employeeRepository.Update(accountId, updatedData);

            if (result)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data updated successfully" });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Failed to update data" });
            }
        }

        [HttpPost("DataTableGetEmployee")]
        public async Task<IActionResult> GetData([FromBody] DataTablesRequest request)
        {
            //var employees = await employeeRepository.GetEmployeeData();
            var query = _context.Accounts.AsQueryable();

            // Implementasi pencarian
            if (!string.IsNullOrEmpty(request.Search?.Value))
            {
                var searchTerm = request.Search.Value.ToLower();
                query = query.Where(e =>
                    e.Fullname.ToLower().Contains(searchTerm) || // Ganti dengan kolom yang ingin Anda cari
                    e.Email.ToLower().Contains(searchTerm) ||
                    e.AccountId.Contains(searchTerm)
                   
                    
                );
            }
       

           
            // Filter, sort, dan paging data berdasarkan permintaan dari DataTables
            // Anda perlu mengimplementasikan logika ini sesuai dengan permintaan DataTables
            // Contoh: products = products.Where(...).OrderBy(...).Skip(...).Take(...);
            var employees = await query.ToListAsync();
            // Menambahkan nomor urut pada setiap baris
          
            var response = new DataTablesResponse
            {
                Draw = request.Draw,
                RecordsTotal = employees.Count(),
                RecordsFiltered = employees.Count(), // Anda perlu mengganti ini dengan jumlah data yang sesuai setelah diterapkan filter
                Data = employees // Data hasil filter dan paging
            };

            return Ok(response);
        }

        
    }
}
