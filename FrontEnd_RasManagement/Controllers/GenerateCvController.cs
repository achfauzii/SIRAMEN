using Microsoft.AspNetCore.Mvc;
using SelectPdf;

namespace FrontEnd_RasManagement.Controllers
{
    public class GenerateCvController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult GenerateCvEmployee()
        {
            return View();
        }
    }






}

