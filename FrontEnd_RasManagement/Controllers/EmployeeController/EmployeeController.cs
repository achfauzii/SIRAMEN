using FrontEnd_RasManagement.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

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

        public IActionResult Educations()
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

        public IActionResult EmploymentHistory()
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

        public IActionResult ProjectHistory()
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

        public IActionResult Certificate()
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

        public IActionResult Qualification()
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
