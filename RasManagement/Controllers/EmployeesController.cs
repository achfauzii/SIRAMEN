
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
    public class EmployeesController : ControllerBase
    {
        private readonly ProjectRasmanagementContext _context;
        private readonly EmployeeRepository employeeRepository;


        public EmployeesController(ProjectRasmanagementContext context, EmployeeRepository employeeRepository)
        {
            _context = context;
            this.employeeRepository = employeeRepository;
        }
        [HttpGet]
        public async Task <IActionResult> Employees()
        {
            var get =await employeeRepository.GetEmployeeData();
            if (get.Count() != 0)
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
            var get =  employeeRepository.Get(accountId);
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
