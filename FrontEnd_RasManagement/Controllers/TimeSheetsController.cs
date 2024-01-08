using FrontEnd_RasManagement.Services;
using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers
{
    public class TimeSheetsController : Controller
    {
        public IActionResult Index()
        {
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }

            var role = JwtHelper.GetRoleFromJwt(HttpContext);

            if (role != "Admin" && role != "Super_Admin")
            {
                return RedirectToAction("Login", "Accounts");
            }
            return View();
        }

        public IActionResult TimeSheetToPdf()
        {
          /*  if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }

            var role = JwtHelper.GetRoleFromJwt(HttpContext);

            if (role != "Admin" && role != "Super_Admin")
            {
                return RedirectToAction("Login", "Accounts");
            }*/
            return View();
        }
    }
}
