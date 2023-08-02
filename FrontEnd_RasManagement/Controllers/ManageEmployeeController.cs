using FrontEnd_RasManagement.Models;
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
            return View();
        }

        public async Task<IActionResult> DetailEmployee(string accountId)
        {
            var accessToken = HttpContext.Session.GetString("Token");
            var url = "https://localhost:7177/api/Employees/accountId?accountId=" + accountId;
            var url2 = "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" + accountId;
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

                ViewData["EmployeeData"] = result;


                ViewData["EmployeePlacement"] = placement;
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
                    description = "",
                    placementStatus = "Belum di buat status penempatan",
                    accountId = "",
                    // account = (object)null
                };
                ViewData["EmployeeData"] = result;
                ViewData["EmployeePlacement"] = placement;

                return View();
            }

        }
    }
}
