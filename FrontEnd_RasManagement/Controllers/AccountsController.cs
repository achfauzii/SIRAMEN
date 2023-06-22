using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers
{
    public class AccountsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Register()
        {
            return View();
        }
    }
}
