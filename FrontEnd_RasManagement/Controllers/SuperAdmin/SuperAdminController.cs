using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers.SuperAdmin
{
    public class SuperAdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult ManageAccounts()
        {
            return View();
        }



    }
}
