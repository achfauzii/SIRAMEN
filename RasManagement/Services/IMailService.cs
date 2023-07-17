
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace RasManagement.Services
{
    public interface IMailService
    {
        //Task SendEmailAsync(MailRequest mailRequest);
        Task SendEmailAsync(string email, string resetUrl);
        //Task SendWelcomeEmailAsync(WelcomeRequest request);
    }
}
