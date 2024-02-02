using Microsoft.AspNetCore.Http;
using System.IdentityModel.Tokens.Jwt;

namespace FrontEnd_RasManagement.Services
{
    public class JwtHelper
    {
        public static void SetToken(HttpContext httpContext, string token)
        {
            if (httpContext.Session.GetString("Token") == null)
            {
                httpContext.Session.SetString("Token", token);
            }
        }

        public static bool IsAuthenticated(HttpContext httpContext)
        {
            return httpContext.Session.GetString("Token") != null;
        }

        public static string GetRoleFromJwt(HttpContext httpContext)
        {
            var token = httpContext.Session.GetString("Token");
            var jwtHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtHandler.ReadJwtToken(token);

            // Find the Role claim and return its value
            var roleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role");
            if (roleClaim != null)
            {
                return roleClaim.Value;
            }

            // Return a default value or handle the case when the role claim is not found
            return "Unknown";
        }

     


    }
}
