using Microsoft.Extensions.Options;
using FrontEnd_RasManagement.Services;
using FrontEnd_RasManagement.Settings;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers
{
    public class SalesProjectionController : Controller
    {
        public IActionResult index()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }

            var role = JwtHelper.GetRoleFromJwt(HttpContext);

            if (role != "Admin")
            {
                return RedirectToAction("Login", "Accounts");
            }

            return View();
        }

        public IActionResult activity()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }

            var role = JwtHelper.GetRoleFromJwt(HttpContext);

            if (role != "Admin")
            {
                return RedirectToAction("Login", "Accounts");
            }

            return View();
        }
    }
}
