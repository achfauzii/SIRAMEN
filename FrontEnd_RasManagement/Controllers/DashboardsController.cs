﻿using FrontEnd_RasManagement.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NuGet.Common;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;

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
           
            bool check = await CheckProfile.CheckingProfile(HttpContext);
            if (check == false)
            {
                ViewData["AlertMessage"] = "You need to fill out your profile before accessing other pages.";
            }
          
            var date = await GetTimeNow();
            /* int totalEmployee = await GetTotalEmployee();*/
            ViewBag.FormattedDate = date;

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

            if (role != "Admin" && role != "Super_Admin" && role !="Trainer" && role != "Sales" && role != "Manager")
            {
                return RedirectToAction("Login", "Accounts");
            }
            //End Validate

            var date = await GetTimeNow();
            int totalEmployee = await GetTotalEmployeeByRoleId(3);
            int idleEmp = await GetTotalIdleOnsiteEmp("idle");
            int onsiteEmp = await GetTotalIdleOnsiteEmp("onsite");
            ViewBag.FormattedDate = date;
            ViewBag.TotalEmployee = totalEmployee;
            ViewBag.IdleEmployee = idleEmp;
            ViewBag.OnsiteEmployee = onsiteEmp;
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
            int idleEmp = await GetTotalIdleOnsiteEmp("idle");
            int onsiteEmp = await GetTotalIdleOnsiteEmp("onsite");
            ViewBag.FormattedDate = date;
            ViewBag.TotalEmployee = totalEmployee;
            ViewBag.IdleEmployee = idleEmp;
            ViewBag.OnsiteEmployee = onsiteEmp;
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
            var url = "https://localhost:7177/api/Employees";
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
            var url = "https://localhost:7177/api/Employees";
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

        public async Task<int> GetTotalIdleOnsiteEmp(string status)
        {
            var accessToken = HttpContext.Session.GetString("Token");
            var url = "https://localhost:7177/api/Employees/GetEmployeeFilter?placementStatus="+status;
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            string jsonResponse = await client.GetStringAsync(url);

            dynamic data = JsonConvert.DeserializeObject(jsonResponse);

            return data.totalData;
        }




    }
}