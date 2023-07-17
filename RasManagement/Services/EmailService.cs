/*using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace RasManagement.Services
{
    public interface IEmailService
    {
        Task SendPasswordResetEmail(string recipientEmail, string resetUrl);
    }

    public class EmailService : IEmailService
    {
        private readonly string _smtpHost;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;

        public EmailService(IConfiguration configuration)
        {
            _smtpHost = configuration["SmtpSettings:SmtpHost"];
            _smtpPort = configuration.GetValue<int>("SmtpSettings:SmtpPort");
            _smtpUsername = configuration["SmtpSettings:SmtpUsername"];
            _smtpPassword = configuration["SmtpSettings:SmtpPassword"];
        }

        public async Task SendPasswordResetEmail(string recipientEmail, string resetUrl)
        {
            // Create the email message
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Your Application", "rasmanagement30@gmail.com"));
            message.To.Add(new MailboxAddress("", recipientEmail));
            message.Subject = "Password Reset";
            message.Body = new TextPart("plain")
            {
                Text = $"Click the following link to reset your password: {resetUrl}"
            };

            // Send the email
            using (var client = new SmtpClient())
            {
                client.Connect(_smtpHost, _smtpPort, SecureSocketOptions.SslOnConnect);

                client.Authenticate(_smtpUsername, _smtpPassword);
                await client.SendAsync(message);
                client.Disconnect(true);
            }
        }
    }
}
*/