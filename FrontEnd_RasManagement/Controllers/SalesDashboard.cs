using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers
{
    public class SalesDashboard : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
