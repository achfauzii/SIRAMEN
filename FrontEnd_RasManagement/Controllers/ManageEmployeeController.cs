using FrontEnd_RasManagement.Models;
using FrontEnd_RasManagement.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace FrontEnd_RasManagement.Controllers
{
    public class ManageEmployeeController : Controller
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

        public async Task<IActionResult> DetailEmployee(string accountId)
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
            var accessToken = HttpContext.Session.GetString("Token");
            var url = "http://192.168.25.189:9001/api/Employees/accountId?accountId=" + accountId;
            var url2 = "http://192.168.25.189:9001/api/EmployeePlacements/accountId?accountId=" + accountId;
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            try
            {
                string jsonResponse = await client.GetStringAsync(url);
                string employeePlacement = await client.GetStringAsync(url2);

                dynamic data = JsonConvert.DeserializeObject(jsonResponse);
                dynamic placement_ = JsonConvert.DeserializeObject(employeePlacement);
                var result = data.data.result;
                var placement = placement_.data;
               /* var startDate = placement.startDate.ToString("dd/MM/yyyy");
                var endDate = placement.endDate.ToString("dd/MM/yyyy");*/

                ViewData["EmployeeData"] = result;


                ViewData["EmployeePlacement"] = placement;
   
              /*  ViewData["StartDate"] = startDate;
                ViewData["EndDate"] = endDate;*/
                return View();
            }
            catch (HttpRequestException ex)
            {
                string jsonResponse = await client.GetStringAsync(url);
                dynamic data = JsonConvert.DeserializeObject(jsonResponse);
                var result = data.data.result;
                var placement = new
                {
                    placementStatusId = "",
                    companyName = "",
                    jobRole="",
                    startDate = "",
                    endDate = "",
                    description = "",
                    placementStatus = "Belum di buat status penempatan",
                    accountId = "",
                    // account = (object)null
                };
                ViewData["EmployeeData"] = result;
                ViewData["EmployeePlacement"] = placement;
                ViewData["StartDate"] =placement.startDate;
                ViewData["EndDate"] = placement.endDate;
               

            

                return View();
            }

        }

        public IActionResult RegisNonRAS()
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

        public IActionResult TurnOverEmployee()
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

        public IActionResult DepartmentEmployee()
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
            //End Validate
            return View("DepartmentEmployee");
        }
    }
}
