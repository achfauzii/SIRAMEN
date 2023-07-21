using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Net.Http.Json;
namespace FrontEnd_RasManagement.Controllers
{
    public class DashboardsController : Controller
    {

        //Dashboard Employee
        public async Task<IActionResult> Employee()
        {
            var date = await GetTimeNow();
            int totalEmployee = await GetTotalEmployee();
            ViewBag.FormattedDate = date;
            ViewBag.TotalEmployee = totalEmployee;
            return View();
        }

        //Dashboard Admin
        public async Task <IActionResult> Dashboard_Admin()
        {
            var date = await GetTimeNow();
            int totalEmployee = await GetTotalEmployee();
            ViewBag.FormattedDate = date;
            ViewBag.TotalEmployee = totalEmployee;
            return View();
        }

        public async Task<IActionResult> Dashboard_SuperAdmin()
        {
            var date = await GetTimeNow();
            int totalEmployee = await GetTotalEmployee();
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
            var url = "https://localhost:7177/api/Employees";
            HttpClient client = new HttpClient();
            string jsonResponse = await client.GetStringAsync(url);

            dynamic data = JsonConvert.DeserializeObject(jsonResponse);
            int totalEmployee = data.totalData;
            return totalEmployee;
        }
    }
}
