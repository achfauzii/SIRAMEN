using Microsoft.Extensions.Options;
using FrontEnd_RasManagement.Services;
using FrontEnd_RasManagement.Settings;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers
{
    public class TimeSheetsController : Controller
    {
        // private readonly IConfiguration _configuration;

        // public TimeSheetsController(IConfiguration configuration)
        // {
        //     _configuration = configuration;
        // }

        public IActionResult Index()
        {
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }

            var role = JwtHelper.GetRoleFromJwt(HttpContext);

            if (role != "Admin" && role != "Super_Admin" && role != "Manager" && role != "Trainer")
            {
                return RedirectToAction("Login", "Accounts");
            }

            IConfigurationRoot configuration = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory())
               .AddJsonFile("appsettings.json")
               .Build();
            var examiner = configuration.GetSection("TimeSheet:Examiner").Value;
            var knownBy = configuration.GetSection("TimeSheet:KnownBy").Value;

            TimeSheet timeSheet = new TimeSheet
            {
                Examiner = examiner,
                KnownBy = knownBy,
            };

            return View(timeSheet);
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
