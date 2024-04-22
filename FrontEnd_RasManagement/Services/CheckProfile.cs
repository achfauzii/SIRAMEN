using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;

namespace FrontEnd_RasManagement.Services
{
    public class CheckProfile
    {
     
        public static async Task<bool> CheckingProfile(HttpContext httpContext)
        {

            try
            {
                var accessToken = httpContext.Session.GetString("Token");
                var accountId = GetAccountId(httpContext);
                HttpClient client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                // Konfigurasi URL API tujuan
                string apiUrl = "https://localhost:7177/api/Employees/accountId?accountId=" + accountId;

                var response = await client.GetAsync(apiUrl);

                // Membaca konten response sebagai string
                string responseContent = await response.Content.ReadAsStringAsync();

                // Menguraikan string JSON menjadi objek atau struktur data yang sesuai
                var data = JsonConvert.DeserializeObject<dynamic>(responseContent);

                // Periksa status respons dari API
                if (response.IsSuccessStatusCode)
                {


                    if (data.data.result.nickname != null && data.data.result.nickname != "" &&
                        data.data.result.birthdate != null &&
                        data.data.result.religion != null && data.data.result.religion != "" &&
                        data.data.result.birthplace != null && data.data.result.birthplace != "" &&
                        data.data.result.maritalstatus != null && data.data.result.maritalstatus != "" &&
                        data.data.result.nationality != null && data.data.result.nationality != "" &&
                        data.data.result.address != null && data.data.result.address != "")
                    {
                        return true;
                    }

                    return false;

                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {

                return false;
            }
        }

        public static string GetAccountId(HttpContext httpContext)
        {
            var token = httpContext.Session.GetString("Token");
            var jwtHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtHandler.ReadJwtToken(token);

            // Find the Role claim and return its value
            var accountId = jwtToken.Claims.FirstOrDefault(c => c.Type == "AccountId");
            if (accountId != null)
            {
                return accountId.Value;
            }

            // Return a default value or handle the case when the role claim is not found
            return "Unknown";
        }
    }
}
