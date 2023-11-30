using FrontEnd_RasManagement.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NuGet.Common;
using System.Net.Http.Headers;
using System.Net.Http.Json;
namespace FrontEnd_RasManagement.Controllers
{
    public class DashboardsController : Controller
    {

        //Dashboard Employee
        public async Task<IActionResult> Employee()
        {
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }

            var date = await GetTimeNow();
            /* int totalEmployee = await GetTotalEmployee();*/
            ViewBag.FormattedDate = date;
            /*  ViewBag.TotalEmployee = totalEmployee;*/

            return View();
        }

        //Dashboard Admin
        public async Task<IActionResult> Dashboard_Admin()
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

            var date = await GetTimeNow();
            int totalEmployee = await GetTotalEmployeeByRoleId(3);
            ViewBag.FormattedDate = date;
            ViewBag.TotalEmployee = totalEmployee;
            return View();
        }

        public async Task<IActionResult> Dashboard_SuperAdmin()
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

            var date = await GetTimeNow();
            int totalEmployee = await GetTotalEmployeeByRoleId(3);
            ViewBag.FormattedDate = date;
            ViewBag.TotalEmployee = totalEmployee;
            return View();
        }

        public async Task<string> GetTimeNow()
        {
            DateTime today = DateTime.Now;
            string formattedDate = today.ToString("dd/MM/yyyy HH:mm:ss");
            return formattedDate;
        }

        public async Task<int> GetTotalEmployee()
        {
            var accessToken = HttpContext.Session.GetString("Token");
<<<<<<< HEAD
            var url = "http://192.168.25.243:9001/api/Employees";
=======
            var url = "https://localhost:7177/api/Employees";
>>>>>>> Fayyad-Clone-Publish
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            string jsonResponse = await client.GetStringAsync(url);

            dynamic data = JsonConvert.DeserializeObject(jsonResponse);
            int totalEmployee = data.totalData;
            return totalEmployee;
        }

        public async Task<int> GetTotalEmployeeByRoleId(int roleId)
        {
            var accessToken = HttpContext.Session.GetString("Token");
<<<<<<< HEAD
            var url = "http://192.168.25.243:9001/api/Employees";
=======
            var url = "https://localhost:7177/api/Employees";
>>>>>>> Fayyad-Clone-Publish
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            string jsonResponse = await client.GetStringAsync(url);

            dynamic data = JsonConvert.DeserializeObject(jsonResponse);
            int totalEmployee = 0;

            if (roleId == 3)
            {
                totalEmployee = 0;
                foreach (var emp in data.data)
                {
                    if (emp.roleId == 3)
                    {
                        totalEmployee++;
                    }
                }
            }
            else
            {
                totalEmployee = data.totalData;
            }

            return totalEmployee;
        }
    }
}