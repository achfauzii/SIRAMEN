using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers.EmployeeController
{
    public class EmployeeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Educations()
        {
            return View();
        }

        public IActionResult EmploymentHistory()
        {
            return View();
        }

    }
}
