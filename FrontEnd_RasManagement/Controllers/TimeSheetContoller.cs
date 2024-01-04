using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers
{
    public class TimeSheetContoller : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
