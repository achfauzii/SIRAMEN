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

            if (role != "Admin" && role != "Super_Admin" && role != "Manager" && role != "Trainer" && role != "Sales")
            {
                return RedirectToAction("Login", "Accounts");
            }
            //End Validate
            return View();
        }

        public async Task<IActionResult> GenerateCvEmployee()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }
            bool check = await CheckProfile.CheckingProfile(HttpContext);
            if (!check)
            {
                return RedirectToAction("Employee", "Dashboards");
            }

            //End Validate
            return View();
        }
    }






}

