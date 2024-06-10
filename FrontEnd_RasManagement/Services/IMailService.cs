
using FrontEnd_RasManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace FrontEnd_RasManagement.Services
{
    public interface IMailService
    {
        Task SendEmailAsync(string email, string resetUrl);
        Task SendEmailNewAccount(string email, string password);

        Task SendEmailBeritaKelahiran(KelahiranVM dataVM);
        Task SendEmailBeritaDukaCita(DukaCitaVM dataVM);
        Task SendEmailBirthday(BirthdayVM birthday);
        Task SendEmailPengaduan(PengaduanVM pengaduanVM);
        Task SendEmailNotifTimesheet(EmployeeData employeeData);

    }
}
