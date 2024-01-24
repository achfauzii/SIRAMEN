using FrontEnd_RasManagement.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

namespace FrontEnd_RasManagement.Controllers.EmployeeController
{
    public class EmployeeController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public EmployeeController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }
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

        public async Task<IActionResult> Educations()
        {
       
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }
        
            bool check = await CheckProfile.CheckingProfile(HttpContext);
            if (!check)
            {
                return RedirectToAction("Employee","Dashboards");
            }
            var role = JwtHelper.GetRoleFromJwt(HttpContext);
            ViewData["UserRole"] = role;
            //End Validate
            return View();
        }


        public async Task<IActionResult> EmploymentHistory()
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
            var role = JwtHelper.GetRoleFromJwt(HttpContext);
            ViewData["UserRole"] = role;
            return View();
        }

        public async Task<IActionResult> ProjectHistory()
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
            var role = JwtHelper.GetRoleFromJwt(HttpContext);
            ViewData["UserRole"] = role;
            return View();
        }

        public async Task<IActionResult> AssetsManagement()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }
      
            //End Validate
            var role = JwtHelper.GetRoleFromJwt(HttpContext);
            ViewData["UserRole"] = role;
            return View();
        }

        public async Task<IActionResult> Certificate()
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
            var role = JwtHelper.GetRoleFromJwt(HttpContext);
            ViewData["UserRole"] = role;
            return View();
        }

        public async Task<IActionResult> Qualification()
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
            var role = JwtHelper.GetRoleFromJwt(HttpContext);
            ViewData["UserRole"] = role;
            return View();
        }

        public async Task<IActionResult> TimeSheet()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }
        
            var role = JwtHelper.GetRoleFromJwt(HttpContext);
            ViewData["UserRole"] = role;
            //End Validate
            return View();
        }

        [HttpPost]
        public IActionResult UploadImage()
        {
            var files = HttpContext.Request.Form.Files;
            if (files.Count > 0)
            {
                var file = files[0];
                if (file.Length > 0)
                {
                    var fileName = Path.GetFileName(file.FileName);

                    // Ubah path penyimpanan menjadi '~/assets/photo/'
                    var path = Path.Combine(_webHostEnvironment.WebRootPath, "assets", "photo", fileName);

                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    return Content("File berhasil diunggah");
                }
            }

            return Content("Terjadi kesalahan saat mengunggah file");
        }

       
        

    }
}
