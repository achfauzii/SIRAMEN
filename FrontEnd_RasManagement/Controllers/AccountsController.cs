using FrontEnd_RasManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace FrontEnd_RasManagement.Controllers
{
    public class AccountsController : Controller
    {
        
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }



        public IActionResult Register_Employee()
        {
            return View();
        }



        /* [HttpPost("register_employee")]
         public async Task<IActionResult> Register_Employee([FromForm] RegisterEmployeeViewModel model)
         {

             try
             {
                 HttpClient client = new HttpClient();

                 // Konfigurasi URL API tujuan
                 string apiUrl = "https://localhost:7177/api/Accounts/Register";

                 // Konversi data dari model menjadi JSON
                 var jsonPayload = Newtonsoft.Json.JsonConvert.SerializeObject(model);

                 // Buat konten untuk permintaan POST
                 var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                 // Kirim permintaan POST ke API tujuan
                 var response = await client.PostAsync(apiUrl, content);

                 // Periksa status respons dari API
                 if (response.IsSuccessStatusCode)
                 {
                     // Registrasi berhasil
                     return Ok("Registration successful");
                 }
                 else
                 {
                     // Registrasi gagal
                     return BadRequest("Registration failed");
                 }
             }
             catch (Exception ex)
             {
                 // Tangani kesalahan yang terjadi
                 return StatusCode(500, $"An error occurred: {ex.Message}");
             }
         }*/
    }





}

