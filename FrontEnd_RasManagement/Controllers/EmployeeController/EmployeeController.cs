using FrontEnd_RasManagement.Services;
using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers.EmployeeController
{
    public class EmployeeController : Controller
    {
        public IActionResult Index()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }
            //End Validate
            return View();
        }

        public IActionResult Educations()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }
            //End Validate
            return View();
        }

        public IActionResult EmploymentHistory()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }
            //End Validate
            return View();
        }

        public IActionResult ProjectHistory()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }
            //End Validate
            return View();
        }

        public IActionResult Certificate()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }
            //End Validate
            return View();
        }

        public IActionResult Qualification()
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
