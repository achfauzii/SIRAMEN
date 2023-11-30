using FrontEnd_RasManagement.Models;
using FrontEnd_RasManagement.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace FrontEnd_RasManagement.Controllers
{
    public class AccountsController : Controller
    {
        private readonly IMailService mailService;
       public AccountsController(IMailService mailService)
        {
        
            this.mailService = mailService;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }


        [HttpGet]
        [HttpPost]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            if (email == null)
            {
                return View();
            }
            try
            {
                HttpClient client = new HttpClient();

                // Konfigurasi URL API tujuan
<<<<<<< HEAD
                string apiUrl = "http://192.168.25.243:9001/api/Accounts/ForgotPassword?email=" + email;
=======
                string apiUrl = "https://localhost:7177/api/Accounts/ForgotPassword?email=" + email;
>>>>>>> Fayyad-Clone-Publish

                // Buat data yang akan dikirim dalam permintaan POST
                var requestData = new { email };

                // Konversi data menjadi JSON
                var jsonPayload = JsonConvert.SerializeObject(requestData);

                // Buat konten untuk permintaan POST
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                // Kirim permintaan POST ke API tujuan
                var response = await client.PostAsync(apiUrl, content);

                // Membaca konten response sebagai string
                string responseContent = await response.Content.ReadAsStringAsync();

                // Menguraikan string JSON menjadi objek atau struktur data yang sesuai
                var data = JsonConvert.DeserializeObject<dynamic>(responseContent);

                // Periksa status respons dari API
                if (response.IsSuccessStatusCode)
                {
                    //Console.WriteLine(response.IsSuccessStatusCode);
                    // Permintaan sukses, kembalikan view yang diinginkan
                    string resetUrl = $"http://192.168.25.243:9005/ResetPassword/{data.data}";
                    await mailService.SendEmailAsync(email, resetUrl);
                    TempData["SuccessMessage"] = "Reset password email has been sent successfully. Please Check your Email";

                    return View();

                }
                else
                {
                    // Permintaan gagal, kembalikan view yang diinginkan dengan pesan kesalahan
                    TempData["FailedMessage"] = "Reset password Failed, Email Not Found";
                    return View();
                }
            }
            catch (Exception ex)
            {
                // Tangani kesalahan yang terjadi, kembalikan view yang diinginkan dengan pesan kesalahan
                ViewBag.ErrorMessage = $"An error occurred: {ex.Message}";
                return View("Error");
            }

        }
        //RESET PASSWORD AFTER FORGOT PASSWORD
        public IActionResult ResetPassword(string resetToken)
        {
            // Mendekode token JWT
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            JwtSecurityToken jwtToken = tokenHandler.ReadJwtToken(resetToken);

            // Mendapatkan nilai claim yang diinginkan
            string email = jwtToken.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;
            var expirationDate = jwtToken.ValidTo;
            var currentTime = DateTime.UtcNow;
            if (currentTime > expirationDate)
            {
                return View("Error");
            }
            ViewBag.Email = email;
            return View("ResetPassword");
        }
        /*  public async Task<IActionResult> ResetPassword()
          {


              return View();

              // Mendekode token JWT
             *//* JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
              JwtSecurityToken jwtToken = tokenHandler.ReadJwtToken(resetToken);
            
              // Mendapatkan nilai claim yang diinginkan
              string email = jwtToken.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;
              var expirationDate = jwtToken.ValidTo;
              var currentTime = DateTime.UtcNow;

              try
              {
                  if(currentTime > expirationDate)
                  {
                      return View("Error");
                  }
                  HttpClient client = new HttpClient();

                  // Konfigurasi URL API tujuan
                  string apiUrl = "http://192.168.25.243:9001/api/Accounts/UpdateForgotPassword";

                  // Membuat objek yang akan dikirim sebagai request body
                  var requestBody = new { email, newPassword };

                  // Konversi objek menjadi JSON
                  var jsonPayload = Newtonsoft.Json.JsonConvert.SerializeObject(requestBody);

                  // Membuat konten untuk permintaan PUT
                  var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");



              }
              catch (Exception ex)
              {
                  // Tangani kesalahan yang terjadi, kembalikan view yang diinginkan dengan pesan kesalahan
                  ViewBag.ErrorMessage = $"An error occurred: {ex.Message}";
                  return View("Error");
              }*//*

          }*/


        //FORGOT PASSWORD END



        /*   public async Task<IActionResult> Auth(string token)
                {

                    HttpContext.Session.SetString("Token", token);
                    // Mendekode token JWT
                    JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
                    JwtSecurityToken jwtToken = tokenHandler.ReadJwtToken(token);

                    // Mendapatkan nilai claim yang diinginkan
                    string userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
                    string email = jwtToken.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;
                    string role = jwtToken.Claims.FirstOrDefault(c => c.Type == "Role")?.Value;




                    Console.WriteLine(userId);

                    // Melakukan tindakan selanjutnya dengan token yang sudah diubah
                    // ...

                    return Ok(role);
                }*/

        public async Task<IActionResult> Auth(string token)
        {
            if (HttpContext.Session.GetString("Token") == null)
            {
                if (ModelState.IsValid)
                {
                    JwtHelper.SetToken(HttpContext, token);
                    // Get the Role from the JWT token
                    //string role = JwtHelper.GetRoleFromJwt(token);
                    //return RedirectToAction("Index", "Departments");
                }
            }

            return RedirectToAction("Login", "Accounts");

        }




        public IActionResult Register_Employee()
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


        //Logout
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("Token");
            HttpContext.Session.Clear();
            return View("Login");

        }



        //New Account
    
      
        [HttpPost]
        public async Task<IActionResult> NewAccount(string email, string password)
        {
            
            try
            {
                    
                await mailService.SendEmailNewAccount(email, password);
                // TempData["SuccessMessage"] = "Reset password email has been sent successfully. Please Check your Email";

                return Ok();

            }
            catch (Exception ex)
            {
                // Tangani kesalahan yang terjadi, kembalikan view yang diinginkan dengan pesan kesalahan
                ViewBag.ErrorMessage = $"An error occurred: {ex.Message}";
                return View("Error");
            }

        }

        /* [HttpPost("register_employee")]
         public async Task<IActionResult> Register_Employee([FromForm] RegisterEmployeeViewModel model)
         {

             try
             {
                 HttpClient client = new HttpClient();

                 // Konfigurasi URL API tujuan
                 string apiUrl = "http://192.168.25.243:9001/api/Accounts/Register";

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


        public IActionResult ChangePassword()
        {
            return View();
        }
    }


 




}

