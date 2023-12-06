using FrontEnd_RasManagement.Services;
using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers.SuperAdmin
{
    public class SuperAdminController : Controller
    {
        public IActionResult Index()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }

            var role = JwtHelper.GetRoleFromJwt(HttpContext);

            if (role != "Super_Admin")
            {
                return RedirectToAction("Login", "Accounts");
            }
            //End Validate
            return View();
        }

        public IActionResult CreateAccounts()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }

            var role = JwtHelper.GetRoleFromJwt(HttpContext);

            if (role != "Super_Admin")
            {
                return RedirectToAction("Login", "Accounts");
            }
            //End Validate
            return View();
        }

        public IActionResult ManageAccounts()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }

            var role = JwtHelper.GetRoleFromJwt(HttpContext);

            if (role != "Super_Admin")
            {
                return RedirectToAction("Login", "Accounts");
            }
            //End Validate
            return View();
        }

        public IActionResult HistoryLogs()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }

            var role = JwtHelper.GetRoleFromJwt(HttpContext);

            if (role != "Super_Admin")
            {
                return RedirectToAction("Login", "Accounts");
            }
            //End Validate
            return View();
        }

    }
}
