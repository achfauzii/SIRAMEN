using FrontEnd_RasManagement.Services;
using Microsoft.AspNetCore.Mvc;
using SelectPdf;

namespace FrontEnd_RasManagement.Controllers
{
    public class GenerateCvController : Controller
    {
        public IActionResult Index()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }

            var role = JwtHelper.GetRoleFromJwt(HttpContext);

            if (role != "Admin" && role != "Super_Admin")
            {
                return RedirectToAction("Login", "Accounts");
            }
            //End Validate
            return View();
        }

        public IActionResult GenerateCvEmployee()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }
          
            //End Validate
            return View();
        }
    }






}

