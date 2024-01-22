using FrontEnd_RasManagement.Services;
using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers
{
    public class ClientController : Controller
    {
        public IActionResult Index()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }

            var role = JwtHelper.GetRoleFromJwt(HttpContext);

            if (role != "Admin" && role != "Super_Admin" && role !="Sales" )
            {
                return RedirectToAction("Login", "Accounts");
            }
           
            return View();
        }
    }
}
