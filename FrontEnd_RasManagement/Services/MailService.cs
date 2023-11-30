using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using FrontEnd_RasManagement.Settings;
using FrontEnd_RasManagement.Models;
using MailKit.Net.Smtp;
using System.Web.Helpers;
using MimeKit.Text;
//using System.Net.Mail;

namespace FrontEnd_RasManagement.Services
{
    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;
        public MailService(IOptions<MailSettings> mailSettings)
        {

            _mailSettings = mailSettings.Value;
        }
        public async Task SendEmailAsync(/*MailRequest mailRequest*/string email, string resetUrl)
        {
            var _email = new MimeMessage();
            _email.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail));
            //_email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
            _email.To.Add(MailboxAddress.Parse(email));
            //email.Subject = mailRequest.Subject;
            _email.Subject = "Password Reset";
            var builder = new BodyBuilder();
            /*  if (mailRequest.Attachments != null)
              {
                  byte[] fileBytes;
                  foreach (var file in mailRequest.Attachments)
                  {
                      if (file.Length > 0)
                      {
                          using (var ms = new MemoryStream())
                          {
                              file.CopyTo(ms);
                              fileBytes = ms.ToArray();
                          }
                          builder.Attachments.Add(file.FileName, fileBytes, ContentType.Parse(file.ContentType));
                      }
                  }
              }*/

            builder.HtmlBody = @"
                                  <!DOCTYPE html PUBLIC ""-//W3C//DTD XHTML 1.0 Strict//EN"" ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"">
                                    <html>

                                    <head>
                                      <!-- Compiled with Bootstrap Email version: 1.3.1 -->
                                      <meta http-equiv=""Content-Type"" content=""text/html; charset=utf-8"">
                                      <meta http-equiv=""x-ua-compatible"" content=""ie=edge"">
                                      <meta name=""x-apple-disable-message-reformatting"">
                                      <meta name=""viewport"" content=""width=device-width, initial-scale=1"">
                                      <meta name=""format-detection"" content=""telephone=no, date=no, address=no, email=no"">
                                      <style type=""text/css"">
                                        body,
                                        table,
                                        td {
                                          font-family: Helvetica, Arial, sans-serif !important
                                        }

                                        .ExternalClass {
                                          width: 100%
                                        }

                                        .ExternalClass,
                                        .ExternalClass p,
                                        .ExternalClass span,
                                        .ExternalClass font,
                                        .ExternalClass td,
                                        .ExternalClass div {
                                          line-height: 150%
                                        }

                                        a {
                                          text-decoration: none
                                        }

                                        * {
                                          color: inherit
                                        }

                                        a[x-apple-data-detectors],
                                        u+#body a,
                                        #MessageViewBody a {
                                          color: inherit;
                                          text-decoration: none;
                                          font-size: inherit;
                                          font-family: inherit;
                                          font-weight: inherit;
                                          line-height: inherit
                                        }

                                        img {
                                          -ms-interpolation-mode: bicubic
                                        }

                                        table:not([class^=s-]) {
                                          font-family: Helvetica, Arial, sans-serif;
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                          border-spacing: 0px;
                                          border-collapse: collapse
                                        }

                                        table:not([class^=s-]) td {
                                          border-spacing: 0px;
                                          border-collapse: collapse
                                        }

                                        @media screen and (max-width: 600px) {

                                          .w-full,
                                          .w-full>tbody>tr>td {
                                            width: 100% !important
                                          }

                                          .w-24,
                                          .w-24>tbody>tr>td {
                                            width: 96px !important
                                          }

                                          .w-40,
                                          .w-40>tbody>tr>td {
                                            width: 160px !important
                                          }

                                          .p-lg-10:not(table),
                                          .p-lg-10:not(.btn)>tbody>tr>td,
                                          .p-lg-10.btn td a {
                                            padding: 0 !important
                                          }

                                          .p-3:not(table),
                                          .p-3:not(.btn)>tbody>tr>td,
                                          .p-3.btn td a {
                                            padding: 12px !important
                                          }

                                          .p-6:not(table),
                                          .p-6:not(.btn)>tbody>tr>td,
                                          .p-6.btn td a {
                                            padding: 24px !important
                                          }

                                          *[class*=s-lg-]>tbody>tr>td {
                                            font-size: 0 !important;
                                            line-height: 0 !important;
                                            height: 0 !important
                                          }

                                          .s-4>tbody>tr>td {
                                            font-size: 16px !important;
                                            line-height: 16px !important;
                                            height: 16px !important
                                          }

                                          .s-6>tbody>tr>td {
                                            font-size: 24px !important;
                                            line-height: 24px !important;
                                            height: 24px !important
                                          }

                                          .s-10>tbody>tr>td {
                                            font-size: 40px !important;
                                            line-height: 40px !important;
                                            height: 40px !important
                                          }
                                        }
                                      </style>
                                    </head>

                                    <body class=""bg-light""
                                      style=""outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;""
                                      bgcolor=""#f7fafc"">
                                      <table class=""bg-light body"" valign=""top"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                        style=""outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;""
                                        bgcolor=""#f7fafc"">
                                        <tbody>
                                          <tr>
                                            <td valign=""top"" style=""line-height: 24px; font-size: 16px; margin: 0;"" align=""left"" bgcolor=""#f7fafc"">
                                              <table class=""container"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""width: 100%;"">
                                                <tbody>
                                                  <tr>
                                                    <td align=""center"" style=""line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;"">
                                                      <!--[if (gte mso 9)|(IE)]>
                                                          <table align=""center"" role=""presentation"">
                                                            <tbody>
                                                              <tr>
                                                                <td width=""600"">
                                                        <![endif]-->
                                                      <table align=""center"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                        style=""width: 100%; max-width: 600px; margin: 0 auto;"">
                                                        <tbody>
                                                          <tr>
                                                            <td style=""line-height: 24px; font-size: 16px; margin: 0;"" align=""left"">
                                                              <table class=""s-10 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                style=""width: 100%;"" width=""100%"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;""
                                                                      align=""left"" width=""100%"" height=""40"">
                                                                      &#160;
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table class=""ax-center"" role=""presentation"" align=""center"" border=""0"" cellpadding=""0""
                                                                cellspacing=""0"" style=""margin: 0 auto;"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 24px; font-size: 16px; margin: 0;"" align=""left"">
                                                                      <!-- <img class=""w-24"" src=""https://www.berca.co.id/wp-content/uploads/2019/09/logo_berca1.png"" style =""height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; width: 300px; border-style: none; border-width: 0;""
                                                                        width=""96""> -->
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table class=""s-10 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                style=""width: 100%;"" width=""100%"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;""
                                                                      align=""left"" width=""100%"" height=""40"">
                                                                      &#160;
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table class=""card p-6 p-lg-10 space-y-4"" role=""presentation"" border=""0"" cellpadding=""0""
                                                                cellspacing=""0""
                                                                style=""border-radius: 6px; border-collapse: separate !important; width: 100%; overflow: hidden; border: 1px solid #e2e8f0;""
                                                                bgcolor=""#ffffff"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 40px;""
                                                                      align=""left"" bgcolor=""#ffffff"">
                                                                      <h1 class=""h3 fw-700""
                                                                        style=""padding-top: 0; padding-bottom: 0; font-weight: 700 !important; vertical-align: baseline; font-size: 28px; line-height: 33.6px; margin: 0;""
                                                                        align=""left"">
                                                                        Password Reset
                                                                      </h1>
                                                                      <table class=""s-4 w-full"" role=""presentation"" border=""0"" cellpadding=""0""
                                                                        cellspacing=""0"" style=""width: 100%;"" width=""100%"">
                                                                        <tbody>
                                                                          <tr>
                                                                            <td
                                                                              style=""line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;""
                                                                              align=""left"" width=""100%"" height=""16"">
                                                                              &#160;
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                                                                      <p class="""" style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                        align=""left"">
                                                                        To reset your password, visit the following address : 
                                                                      </p>
                                                                      <table class=""s-4 w-full"" role=""presentation"" border=""0"" cellpadding=""0""
                                                                        cellspacing=""0"" style=""width: 100%;"" width=""100%"">
                                                                        <tbody>
                                                                          <tr>
                                                                            <td
                                                                              style=""line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;""
                                                                              align=""left"" width=""100%"" height=""16"">
                                                                              &#160;
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                                                                      <table class=""btn btn-primary p-3 fw-700"" role=""presentation"" border=""0""
                                                                        cellpadding=""0"" cellspacing=""0""
                                                                        style=""border-radius: 6px; border-collapse: separate !important; font-weight: 700 !important;margin: 0 auto;"">
                                                                        <tbody>
                                                                          <tr>
                                                                            <td
                                                                              style=""line-height: 24px; font-size: 16px; border-radius: 6px; font-weight: 700 !important; margin: 0;""
                                                                              align=""center"" bgcolor=""#0d6efd"">
                                                                              <a href=" + resetUrl + @"
                                                                                style=""color: #ffffff; font-size: 16px; font-family: Helvetica, Arial, sans-serif; text-decoration: none; border-radius: 6px; line-height: 20px; display: block; font-weight: 700 !important; white-space: nowrap; background-color: #0d6efd; padding: 12px; border: 1px solid #0d6efd;"">Reset Password</a>
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                                                                      <p class="""" style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                        align=""left"">
                                                                        If the button cannot be clicked, please click the following link : " + resetUrl + @"
                                                                      </p>
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table class=""s-10 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                style=""width: 100%;"" width=""100%"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;""
                                                                      align=""left"" width=""100%"" height=""40"">
                                                                      &#160;
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>

                                                              <table class=""s-6 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                style=""width: 100%;"" width=""100%"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;""
                                                                      align=""left"" width=""100%"" height=""24"">
                                                                      &#160;
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <div class=""text-muted text-center"" style=""color: #718096;"" align=""center"">
                                                               Sent with &#10084 from RAS Management. <br>
                                                                Jl. Abdul Muis No.62 <br>
                                                                Gambir, Kota Jakarta Pusat, DKI Jakarta 10160<br>
                                                              </div>
                                                              <table class=""s-6 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                style=""width: 100%;"" width=""100%"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;""
                                                                      align=""left"" width=""100%"" height=""24"">
                                                                      &#160;
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                      <!--[if (gte mso 9)|(IE)]>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                        <![endif]-->
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </body>

                                    </html>

                                   ";

            _email.Body = builder.ToMessageBody();






            /*_email.Body = new TextPart("plain")
            {
                Text = $"Click the following link to reset your password: {resetUrl}"
            };
*/

            using var smtp = new SmtpClient();
            smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
            await smtp.SendAsync(_email);
            smtp.Disconnect(true);
        }

        /*public async Task SendWelcomeEmailAsync(WelcomeRequest request)
        {
            string FilePath = Directory.GetCurrentDirectory() + "\\Templates\\WelcomeTemplate.html";
            StreamReader str = new StreamReader(FilePath);
            string MailText = str.ReadToEnd();
            str.Close();
            MailText = MailText.Replace("[username]", request.UserName).Replace("[email]", request.ToEmail);
            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
            email.To.Add(MailboxAddress.Parse(request.ToEmail));
            email.Subject = $"Welcome {request.UserName}";
            var builder = new BodyBuilder();
            builder.HtmlBody = MailText;
            email.Body = builder.ToMessageBody();
            using var smtp = new SmtpClient();
            smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
            await smtp.SendAsync(email);
            smtp.Disconnect(true);
        }*/

        public async Task SendEmailNewAccount(/*MailRequest mailRequest*/string email, string password)
        {
            var _email = new MimeMessage();
            //_email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
            _email.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail));
            _email.To.Add(MailboxAddress.Parse(email));
            //email.Subject = mailRequest.Subject;
            _email.Subject = "New Account";
            var builder = new BodyBuilder();


            builder.HtmlBody = @"
                                  <!DOCTYPE html PUBLIC ""-//W3C//DTD XHTML 1.0 Strict//EN"" ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"">
                                    <html>

                                    <head>
                                      <!-- Compiled with Bootstrap Email version: 1.3.1 -->
                                      <meta http-equiv=""Content-Type"" content=""text/html; charset=utf-8"">
                                      <meta http-equiv=""x-ua-compatible"" content=""ie=edge"">
                                      <meta name=""x-apple-disable-message-reformatting"">
                                      <meta name=""viewport"" content=""width=device-width, initial-scale=1"">
                                      <meta name=""format-detection"" content=""telephone=no, date=no, address=no, email=no"">
                                      <style type=""text/css"">
                                        body,
                                        table,
                                        td {
                                          font-family: Helvetica, Arial, sans-serif !important
                                        }

                                        .ExternalClass {
                                          width: 100%
                                        }

                                        .ExternalClass,
                                        .ExternalClass p,
                                        .ExternalClass span,
                                        .ExternalClass font,
                                        .ExternalClass td,
                                        .ExternalClass div {
                                          line-height: 150%
                                        }

                                        a {
                                          text-decoration: none
                                        }

                                        * {
                                          color: inherit
                                        }

                                        a[x-apple-data-detectors],
                                        u+#body a,
                                        #MessageViewBody a {
                                          color: inherit;
                                          text-decoration: none;
                                          font-size: inherit;
                                          font-family: inherit;
                                          font-weight: inherit;
                                          line-height: inherit
                                        }

                                        img {
                                          -ms-interpolation-mode: bicubic
                                        }

                                        table:not([class^=s-]) {
                                          font-family: Helvetica, Arial, sans-serif;
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                          border-spacing: 0px;
                                          border-collapse: collapse
                                        }

                                        table:not([class^=s-]) td {
                                          border-spacing: 0px;
                                          border-collapse: collapse
                                        }

                                        @media screen and (max-width: 600px) {

                                          .w-full,
                                          .w-full>tbody>tr>td {
                                            width: 100% !important
                                          }

                                          .w-24,
                                          .w-24>tbody>tr>td {
                                            width: 96px !important
                                          }

                                          .w-40,
                                          .w-40>tbody>tr>td {
                                            width: 160px !important
                                          }

                                          .p-lg-10:not(table),
                                          .p-lg-10:not(.btn)>tbody>tr>td,
                                          .p-lg-10.btn td a {
                                            padding: 0 !important
                                          }

                                          .p-3:not(table),
                                          .p-3:not(.btn)>tbody>tr>td,
                                          .p-3.btn td a {
                                            padding: 12px !important
                                          }

                                          .p-6:not(table),
                                          .p-6:not(.btn)>tbody>tr>td,
                                          .p-6.btn td a {
                                            padding: 24px !important
                                          }

                                          *[class*=s-lg-]>tbody>tr>td {
                                            font-size: 0 !important;
                                            line-height: 0 !important;
                                            height: 0 !important
                                          }

                                          .s-4>tbody>tr>td {
                                            font-size: 16px !important;
                                            line-height: 16px !important;
                                            height: 16px !important
                                          }

                                          .s-6>tbody>tr>td {
                                            font-size: 24px !important;
                                            line-height: 24px !important;
                                            height: 24px !important
                                          }

                                          .s-10>tbody>tr>td {
                                            font-size: 40px !important;
                                            line-height: 40px !important;
                                            height: 40px !important
                                          }
                                        }
                                      </style>
                                    </head>

                                    <body class=""bg-light""
                                      style=""outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;""
                                      bgcolor=""#f7fafc"">
                                      <table class=""bg-light body"" valign=""top"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                        style=""outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;""
                                        bgcolor=""#f7fafc"">
                                        <tbody>
                                          <tr>
                                            <td valign=""top"" style=""line-height: 24px; font-size: 16px; margin: 0;"" align=""left"" bgcolor=""#f7fafc"">
                                              <table class=""container"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""width: 100%;"">
                                                <tbody>
                                                  <tr>
                                                    <td align=""center"" style=""line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;"">
                                                      <!--[if (gte mso 9)|(IE)]>
                                                          <table align=""center"" role=""presentation"">
                                                            <tbody>
                                                              <tr>
                                                                <td width=""600"">
                                                        <![endif]-->
                                                      <table align=""center"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                        style=""width: 100%; max-width: 600px; margin: 0 auto;"">
                                                        <tbody>
                                                          <tr>
                                                            <td style=""line-height: 24px; font-size: 16px; margin: 0;"" align=""left"">
                                                              <table class=""s-10 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                style=""width: 100%;"" width=""100%"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;""
                                                                      align=""left"" width=""100%"" height=""40"">
                                                                      &#160;
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <!-- <table class=""ax-center"" role=""presentation"" align=""center"" border=""0"" cellpadding=""0""
                                                                cellspacing=""0"" style=""margin: 0 auto;"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 24px; font-size: 16px; margin: 0;"" align=""left"">
                                                                      <!-- <img class=""w-24"" src=""https://www.berca.co.id/wp-content/uploads/2019/09/logo_berca1.png"" style =""height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; width: 300px; border-style: none; border-width: 0;""
                                                                        width=""96""> -->
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table> -->
                                                              <table class=""s-10 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                style=""width: 100%;"" width=""100%"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;""
                                                                      align=""left"" width=""100%"" height=""40"">
                                                                      &#160;
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table class=""card p-6 p-lg-10 space-y-4"" role=""presentation"" border=""0"" cellpadding=""0""
                                                                cellspacing=""0""
                                                                style=""border-radius: 6px; border-collapse: separate !important; width: 100%; overflow: hidden; border: 1px solid #e2e8f0;""
                                                                bgcolor=""#ffffff"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 40px;""
                                                                      align=""left"" bgcolor=""#ffffff"">
                                                                      <h1 class=""h3 fw-700""
                                                                        style=""padding-top: 0; padding-bottom: 0; font-weight: 700 !important; vertical-align: baseline; font-size: 28px; line-height: 33.6px; margin: 0;""
                                                                        align=""left"">
                                                                        New Account Information
                                                                      </h1>
                                                                      <table class=""s-4 w-full"" role=""presentation"" border=""0"" cellpadding=""0""
                                                                        cellspacing=""0"" style=""width: 100%;"" width=""100%"">
                                                                        <tbody>
                                                                          <tr>
                                                                            <td
                                                                              style=""line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;""
                                                                              align=""left"" width=""100%"" height=""16"">
                                                                              &#160;
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                                                                      <p class="""" style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                        align=""left"">
                                                                        Your new account email and password Resource Application Service Department: 
                                                                      </p>
                                                                      <table class=""s-4 w-full"" role=""presentation"" border=""0"" cellpadding=""0""
                                                                        cellspacing=""0"" style=""width: 100%;"" width=""100%"">
                                                                        <tbody>
                                                                          <tr>
                                                                            <td
                                                                              style=""line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;""
                                                                              align=""left"" width=""100%"" height=""16"">
                                                                              &#160;
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                                                                    
                                                                      <p class="""" style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                        align=""left"">
                                                                        Email : " + email + @"
                                                                      </p>

                                                                      <p class="" style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                        align=""left"">Password : " + password + @"</p>

                                                                        <table class=""s-4 w-full"" role=""presentation"" border=""0"" cellpadding=""0""
                                                                        cellspacing=""0"" style=""width: 100%;"" width=""100%"">
                                                                        <tbody>
                                                                          <tr>
                                                                            <td
                                                                              style=""line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;""
                                                                              align=""left"" width=""100%"" height=""16"">
                                                                              &#160;
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table>

                                                                      <center><table class=""btn btn-primary p-3 fw-700"" role=""presentation"" border=""0""
                                                                        cellpadding=""0"" cellspacing=""0""
                                                                        style=""border-radius: 6px; border-collapse: separate !important; font-weight: 700 !important;margin: 0 auto;"">
                                                                        <tbody>
                                                                          <tr>
                                                                            <td
                                                                              style=""line-height: 24px; font-size: 16px; border-radius: 6px; font-weight: 700 !important; margin: 0;""
                                                                              align=""center"" bgcolor=""#0d6efd"">
                                                                              <a href=""https://127.0.0.1:7109""
                                                                                style=""color: #ffffff; font-size: 16px; font-family: Helvetica, Arial, sans-serif; text-decoration: none; border-radius: 6px; line-height: 20px; display: block; font-weight: 700 !important; white-space: nowrap; background-color: #0d6efd; padding: 12px; border: 1px solid #0d6efd;"">Login Here</a>
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table></center>
                                                                      
                                                                      <p class="" style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                        align=""left"">
                                                                        <b>Please change your password immediately to enhance the security of your account.</b>
                                                                        </p>   
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>                                                             

                                                              <table class=""s-6 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                style=""width: 100%;"" width=""100%"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;""
                                                                      align=""left"" width=""100%"" height=""24"">
                                                                      &#160;
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <div class=""text-muted text-center"" style=""color: #718096;"" align=""center"">
                                                                Sent with &#10084 from RAS Management. <br>
                                                                Jl. Abdul Muis No.62 <br>
                                                                Gambir, Kota Jakarta Pusat, DKI Jakarta 10160<br>
                                                              </div>
                                                              <table class=""s-6 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                style=""width: 100%;"" width=""100%"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;""
                                                                      align=""left"" width=""100%"" height=""24"">
                                                                      &#160;
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </td>
                                                          </tr>

                                                        </tbody>
                                                      </table>
                                                      <!--[if (gte mso 9)|(IE)]>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                        <![endif]-->
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </body>

                                    </html>

                                   ";

            _email.Body = builder.ToMessageBody();


            using var smtp = new SmtpClient();
            smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
            await smtp.SendAsync(_email);
            smtp.Disconnect(true);

        }

        public async Task SendEmailBeritaKelahiran(KelahiranVM data)
        {

            var _email = new MimeMessage();
            _email.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail));
            //_email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
            //_email.To.Add(MailboxAddress.Parse("yogi.prasetio@berca.co.id"));

            foreach (var item in data.email)
            {
                _email.To.Add(MailboxAddress.Parse(item));
            }
            _email.Subject = data.title;

            var builder = new BodyBuilder();

            builder.HtmlBody = @"
                                  <!DOCTYPE html PUBLIC ""-//W3C//DTD XHTML 1.0 Strict//EN"" ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"">
                                    <html>

                                    <head>
                                      <!-- Compiled with Bootstrap Email version: 1.3.1 -->
                                      <meta http-equiv=""Content-Type"" content=""text/html; charset=utf-8"">
                                      <meta http-equiv=""x-ua-compatible"" content=""ie=edge"">
                                      <meta name=""x-apple-disable-message-reformatting"">
                                      <meta name=""viewport"" content=""width=device-width, initial-scale=1"">
                                      <meta name=""format-detection"" content=""telephone=no, date=no, address=no, email=no"">
                                      <style type=""text/css"">
                                        body,
                                        table,
                                        td {
                                          font-family: Helvetica, Arial, sans-serif !important
                                        }

                                        .ExternalClass {
                                          width: 100%
                                        }

                                        .ExternalClass,
                                        .ExternalClass p,
                                        .ExternalClass span,
                                        .ExternalClass font,
                                        .ExternalClass td,
                                        .ExternalClass div {
                                          line-height: 150%
                                        }

                                        a {
                                          text-decoration: none
                                        }

                                        * {
                                          color: inherit
                                        }

                                        a[x-apple-data-detectors],
                                        u+#body a,
                                        #MessageViewBody a {
                                          color: inherit;
                                          text-decoration: none;
                                          font-size: inherit;
                                          font-family: inherit;
                                          font-weight: inherit;
                                          line-height: inherit
                                        }

                                        img {
                                          -ms-interpolation-mode: bicubic
                                        }

                                        table:not([class^=s-]) {
                                          font-family: Helvetica, Arial, sans-serif;
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                          border-spacing: 0px;
                                          border-collapse: collapse
                                        }

                                        table:not([class^=s-]) td {
                                          border-spacing: 0px;
                                          border-collapse: collapse
                                        }

                                        @media screen and (max-width: 600px) {

                                          .w-full,
                                          .w-full>tbody>tr>td {
                                            width: 100% !important
                                          }

                                          .w-24,
                                          .w-24>tbody>tr>td {
                                            width: 96px !important
                                          }

                                          .w-40,
                                          .w-40>tbody>tr>td {
                                            width: 160px !important
                                          }

                                          .p-lg-10:not(table),
                                          .p-lg-10:not(.btn)>tbody>tr>td,
                                          .p-lg-10.btn td a {
                                            padding: 0 !important
                                          }

                                          .p-3:not(table),
                                          .p-3:not(.btn)>tbody>tr>td,
                                          .p-3.btn td a {
                                            padding: 12px !important
                                          }

                                          .p-6:not(table),
                                          .p-6:not(.btn)>tbody>tr>td,
                                          .p-6.btn td a {
                                            padding: 24px !important
                                          }

                                          *[class*=s-lg-]>tbody>tr>td {
                                            font-size: 0 !important;
                                            line-height: 0 !important;
                                            height: 0 !important
                                          }

                                          .s-4>tbody>tr>td {
                                            font-size: 16px !important;
                                            line-height: 16px !important;
                                            height: 16px !important
                                          }

                                          .s-6>tbody>tr>td {
                                            font-size: 24px !important;
                                            line-height: 24px !important;
                                            height: 24px !important
                                          }

                                          .s-10>tbody>tr>td {
                                            font-size: 40px !important;
                                            line-height: 40px !important;
                                            height: 40px !important
                                          }
                                        }
                                      </style>
                                    </head>

                                    <body class=""bg-light""
                                      style=""outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;""
                                      bgcolor=""#f7fafc"">
                                      <table class=""bg-light body"" valign=""top"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                        style=""outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;""
                                        bgcolor=""#f7fafc"">
                                        <tbody>
                                          <tr>
                                            <td valign=""top"" style=""line-height: 24px; font-size: 16px; margin: 0;"" align=""left"" bgcolor=""#f7fafc"">
                                              <table class=""container"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""width: 100%;"">
                                                <tbody>
                                                  <tr>
                                                    <td align=""center"" style=""line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;"">
                                                      <!--[if (gte mso 9)|(IE)]>
                                                          <table align=""center"" role=""presentation"">
                                                            <tbody>
                                                              <tr>
                                                                <td width=""600"">
                                                        <![endif]-->
                                                      <table align=""center"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                        style=""width: 100%; max-width: 600px; margin: 0 auto;"">
                                                        <tbody>
                                                          <tr>
                                                            <td style=""line-height: 24px; font-size: 16px; margin: 0;"" align=""left"">
                                                              <table class=""s-10 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                style=""width: 100%;"" width=""100%"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;""
                                                                      align=""left"" width=""100%"" height=""40"">
                                                                      &#160;
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              
                                                              <table class=""s-10 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                style=""width: 100%;"" width=""100%"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;""
                                                                      align=""left"" width=""100%"" height=""40"">
                                                                      &#160;
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table class=""card p-6 p-lg-10 space-y-4"" role=""presentation"" border=""0"" cellpadding=""0""
                                                                cellspacing=""0""
                                                                style=""border-radius: 6px; border-collapse: separate !important; width: 100%; overflow: hidden; border: 1px solid #e2e8f0;""
                                                                bgcolor=""#ffffff"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 40px;""
                                                                      align=""left"" bgcolor=""#ffffff"">
                                                                      <h1 class=""h3 fw-700""
                                                                        style=""padding-top: 0; padding-bottom: 0; font-weight: 700 !important; vertical-align: baseline; font-size: 28px; line-height: 33.6px; margin: 0;""
                                                                        align=""Center"">
                                                                        Berita Kelahiran
                                                                      </h1>
                                                                      <table class=""s-4 w-full"" role=""presentation"" border=""0"" cellpadding=""0""
                                                                        cellspacing=""0"" style=""width: 100%;"" width=""100%"">
                                                                        <tbody>
                                                                          <tr>
                                                                            <td
                                                                              style=""line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;""
                                                                              align=""left"" width=""100%"" height=""16"">
                                                                              &#160;
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                                                                      <p class="""" style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                        align=""left"">
                                                                         Telah lahir " + data.gender + " <b>" + data.child + "</b> dari Sdr. <b>" + data.employee + @"</b>. <br><br>
                                                                         Pada hari " + data.birthdate + @" Pukul " + data.birthtime + @" WIB, di " + data.birthplace + @".<br> 
                                                                      </p>
                                                                      <table class=""s-4 w-full"" role=""presentation"" border=""0"" cellpadding=""0""
                                                                        cellspacing=""0"" style=""width: 100%;"" width=""100%"">
                                                                        <tbody>
                                                                          <tr>
                                                                            <td
                                                                              style=""line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;""
                                                                              align=""left"" width=""100%"" height=""16"">
                                                                              &#160;
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                                                                    
                                                                      <p class="""" style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                        align=""left"">
                                                                         Dengan Berat " + data.weight + @" kg, Panjang " + data.length + @" cm <br>
                                                                         Di beri nama <b><i>“" + data.name + @"”</i></b>
                                                                      </p>

                                                                      <p class="" style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                        align=""left"">
                                                                        <br>Selamat kepada Sdr. " + data.employee + @" dan keluarga<br>
                                                                            Semoga menjadi anak yang berbakti dan membawa kebahagiaan bagi keluarga ini.
                                                                            Tuhan memberkati.
                                                                      </p>

                                                                      <p class="" style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                      align=""left"">
                                                                      Salam Hangat, <br>
                                                                      Team Resource & Application Service.                                 
                                                                      </p>
   
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <table class=""s-10 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                style=""width: 100%;"" width=""100%"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;""
                                                                      align=""left"" width=""100%"" height=""40"">
                                                                      &#160;
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>

                                                              <table class=""s-6 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                style=""width: 100%;"" width=""100%"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;""
                                                                      align=""left"" width=""100%"" height=""24"">
                                                                      &#160;
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                              <div class=""text-muted text-center"" style=""color: #718096;"" align=""center"">
                                                                 Sent with &#10084 from RAS Management. <br>
                                                                 Jl. Abdul Muis No.62 <br>
                                                                 Gambir, Kota Jakarta Pusat, DKI Jakarta 10160<br>
                                                              </div>
                                                              <table class=""s-6 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                style=""width: 100%;"" width=""100%"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style=""line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;""
                                                                      align=""left"" width=""100%"" height=""24"">
                                                                      &#160;
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                      <!--[if (gte mso 9)|(IE)]>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                        <![endif]-->
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </body>

                                    </html>";

            _email.Body = builder.ToMessageBody();


            using var smtp = new SmtpClient();
            smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);

            await smtp.SendAsync(_email);

            //SendEmail(smtp, _mailSettings.Mail, "yogi.bhp10188@gmail.com", data.title, builder);
            //foreach (string toEmail in data.email)
            //{
            //    SendEmail(smtp, _mailSettings.Mail, toEmail, data.title, builder);
            //}

            smtp.Disconnect(true);

        }



        public async Task SendEmailBeritaDukaCita(DukaCitaVM data)
        {
            var _email = new MimeMessage();
            _email.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail));
            //_email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
            foreach (var item in data.email)
            {
                _email.To.Add(MailboxAddress.Parse(item));
            }
            _email.Subject = data.title;

            var builder = new BodyBuilder();


            builder.HtmlBody = @"
                                 <!DOCTYPE html PUBLIC ""-//W3C//DTD XHTML 1.0 Strict//EN"" ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"">
                                        <html>

                                        <head>
                                          <!-- Compiled with Bootstrap Email version: 1.3.1 -->
                                          <meta http-equiv=""Content-Type"" content=""text/html; charset=utf-8"">
                                          <meta http-equiv=""x-ua-compatible"" content=""ie=edge"">
                                          <meta name=""x-apple-disable-message-reformatting"">
                                          <meta name=""viewport"" content=""width=device-width, initial-scale=1"">
                                          <meta name=""format-detection"" content=""telephone=no, date=no, address=no, email=no"">
                                          <style type=""text/css"">
                                            body,
                                            table,
                                            td {
                                              font-family: Helvetica, Arial, sans-serif !important
                                            }

                                            .ExternalClass {
                                              width: 100%
                                            }

                                            .ExternalClass,
                                            .ExternalClass p,
                                            .ExternalClass span,
                                            .ExternalClass font,
                                            .ExternalClass td,
                                            .ExternalClass div {
                                              line-height: 150%
                                            }

                                            a {
                                              text-decoration: none
                                            }

                                            * {
                                              color: inherit
                                            }

                                            a[x-apple-data-detectors],
                                            u+#body a,
                                            #MessageViewBody a {
                                              color: inherit;
                                              text-decoration: none;
                                              font-size: inherit;
                                              font-family: inherit;
                                              font-weight: inherit;
                                              line-height: inherit
                                            }

                                            img {
                                              -ms-interpolation-mode: bicubic
                                            }

                                            table:not([class^=s-]) {
                                              font-family: Helvetica, Arial, sans-serif;
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-spacing: 0px;
                                              border-collapse: collapse
                                            }

                                            table:not([class^=s-]) td {
                                              border-spacing: 0px;
                                              border-collapse: collapse
                                            }

                                            @media screen and (max-width: 600px) {

                                              .w-full,
                                              .w-full>tbody>tr>td {
                                                width: 100% !important
                                              }

                                              .w-24,
                                              .w-24>tbody>tr>td {
                                                width: 96px !important
                                              }

                                              .w-40,
                                              .w-40>tbody>tr>td {
                                                width: 160px !important
                                              }

                                              .p-lg-10:not(table),
                                              .p-lg-10:not(.btn)>tbody>tr>td,
                                              .p-lg-10.btn td a {
                                                padding: 0 !important
                                              }

                                              .p-3:not(table),
                                              .p-3:not(.btn)>tbody>tr>td,
                                              .p-3.btn td a {
                                                padding: 12px !important
                                              }

                                              .p-6:not(table),
                                              .p-6:not(.btn)>tbody>tr>td,
                                              .p-6.btn td a {
                                                padding: 24px !important
                                              }

                                              *[class*=s-lg-]>tbody>tr>td {
                                                font-size: 0 !important;
                                                line-height: 0 !important;
                                                height: 0 !important
                                              }

                                              .s-4>tbody>tr>td {
                                                font-size: 16px !important;
                                                line-height: 16px !important;
                                                height: 16px !important
                                              }

                                              .s-6>tbody>tr>td {
                                                font-size: 24px !important;
                                                line-height: 24px !important;
                                                height: 24px !important
                                              }

                                              .s-10>tbody>tr>td {
                                                font-size: 40px !important;
                                                line-height: 40px !important;
                                                height: 40px !important
                                              }
                                            }
                                          </style>
                                        </head>

                                        <body class=""bg-light""
                                          style=""outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;""
                                          bgcolor=""#f7fafc"">
                                          <table class=""bg-light body"" valign=""top"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                            style=""outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;""
                                            bgcolor=""#f7fafc"">
                                            <tbody>
                                              <tr>
                                                <td valign=""top"" style=""line-height: 24px; font-size: 16px; margin: 0;"" align=""left"" bgcolor=""#f7fafc"">
                                                  <table class=""container"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""width: 100%;"">
                                                    <tbody>
                                                      <tr>
                                                        <td align=""center"" style=""line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;"">
                                                          <!--[if (gte mso 9)|(IE)]>
                                                              <table align=""center"" role=""presentation"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td width=""600"">
                                                            <![endif]-->
                                                          <table align=""center"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                            style=""width: 100%; max-width: 600px; margin: 0 auto;"">
                                                            <tbody>
                                                              <tr>
                                                                <td style=""line-height: 24px; font-size: 16px; margin: 0;"" align=""left"">
                                                                  <table class=""s-10 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                    style=""width: 100%;"" width=""100%"">
                                                                    <tbody>
                                                                      <tr>
                                                                        <td style=""line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;""
                                                                          align=""left"" width=""100%"" height=""40"">
                                                                          &#160;
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                  <!--<table class=""ax-center"" role=""presentation"" align=""center"" border=""0"" cellpadding=""0""
                                                                    cellspacing=""0"" style=""margin: 0 auto;"">
                                                                    <tbody>
                                                                      <tr>
                                                                        <td style=""line-height: 24px; font-size: 16px; margin: 0;"" align=""left"">
                                                                          <!-- <img class=""w-24"" src=""https://www.berca.co.id/wp-content/uploads/2019/09/logo_berca1.png"" style =""height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; width: 300px; border-style: none; border-width: 0;""
                                                                            width=""96""> -->
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table> -->
                                                                  <table class=""s-10 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                    style=""width: 100%;"" width=""100%"">
                                                                    <tbody>
                                                                      <tr>
                                                                        <td style=""line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;""
                                                                          align=""left"" width=""100%"" height=""40"">
                                                                          &#160;
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                  <table class=""card p-6 p-lg-10 space-y-4"" role=""presentation"" border=""0"" cellpadding=""0""
                                                                    cellspacing=""0""
                                                                    style=""border-radius: 6px; border-collapse: separate !important; width: 100%; overflow: hidden; border: 1px solid #e2e8f0;""
                                                                    bgcolor=""#ffffff"">
                                                                    <tbody>
                                                                      <tr>
                                                                        <td style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 40px;""
                                                                          align=""left"" bgcolor=""#ffffff"">
                                                                          <h1 class=""h3 fw-700""
                                                                            style=""padding-top: 0; padding-bottom: 0; font-weight: 700 !important; vertical-align: baseline; font-size: 28px; line-height: 33.6px; margin: 0;""
                                                                            align=""center"">
                                                                            Berita Duka Cita
                                                                          </h1>
                                                                          <table class=""s-4 w-full"" role=""presentation"" border=""0"" cellpadding=""0""
                                                                            cellspacing=""0"" style=""width: 100%;"" width=""100%"">
                                                                            <tbody>
                                                                              <tr>
                                                                                <td
                                                                                  style=""line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;""
                                                                                  align=""left"" width=""100%"" height=""16"">
                                                                                  &#160;
                                                                                </td>
                                                                              </tr>
                                                                            </tbody>
                                                                          </table>
                                                                          <p class="""" style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                            align=""left"">

                                                                            Telah meninggal dunia, <b>" + data.name + @"</b> usia " + data.age + @" tahun, " + data.relation + @" dari rekan kita Sdr. <b>" + data.employee + @"</b>.



                                                                          </p>
                                                                          <table class=""s-4 w-full"" role=""presentation"" border=""0"" cellpadding=""0""
                                                                            cellspacing=""0"" style=""width: 100%;"" width=""100%"">
                                                                            <tbody>
                                                                              <tr>
                                                                                <td
                                                                                  style=""line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;""
                                                                                  align=""left"" width=""100%"" height=""16"">
                                                                                  &#160;
                                                                                </td>
                                                                              </tr>
                                                                            </tbody>
                                                                          </table>
                                
                                                                          <p class="""" style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                            align=""left"">

                                                                            Pada hari " + data.deathday + @", Pukul " + data.deathtime + @" WIB, di " + data.deathplace + @".
                   
                                                                          </p>

                                                                          <p class="" style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                            align=""left"">
                                                                            Atas nama RAS Management PT. Berca Hardayaperkasa mengucapkan Turut Berduka Cita. <br>
                                                                            Semoga amal ibadahnya diterima di sisi Tuhan yang Maha Kuasa dan Keluarga yang ditinggalkan diberikan kekuatan serta ketabahan .

                                                                          </p>

                                                                          <p class="" style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                          align=""left"">
                                                                          Terima kasih,<br>
                                                                          RAS Department.
                             
                                                                          </p>

                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                  <table class=""s-10 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                    style=""width: 100%;"" width=""100%"">
                                                                    <tbody>
                                                                      <tr>
                                                                        <td style=""line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;""
                                                                          align=""left"" width=""100%"" height=""40"">
                                                                          &#160;
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>

                                                                  <table class=""s-6 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                    style=""width: 100%;"" width=""100%"">
                                                                    <tbody>
                                                                      <tr>
                                                                        <td style=""line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;""
                                                                          align=""left"" width=""100%"" height=""24"">
                                                                          &#160;
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                  <div class=""text-muted text-center"" style=""color: #718096;"" align=""center"">
                                                                    Sent with &#10084 from RAS Management. <br>
                                                                    Jl. Abdul Muis No.62 <br>
                                                                    Gambir, Kota Jakarta Pusat, DKI Jakarta 10160.<br>
                                                                  </div>
                                                                  <table class=""s-6 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                    style=""width: 100%;"" width=""100%"">
                                                                    <tbody>
                                                                      <tr>
                                                                        <td style=""line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;""
                                                                          align=""left"" width=""100%"" height=""24"">
                                                                          &#160;
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                          <!--[if (gte mso 9)|(IE)]>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                            <![endif]-->
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </body>

                                        </html>
                                   ";

            _email.Body = builder.ToMessageBody();


            using var smtp = new SmtpClient();
            smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);

            await smtp.SendAsync(_email);

            //SendEmail(smtp, _mailSettings.Mail, "yogi.bhp10188@gmail.com", data.title, builder);            
            //foreach (string toEmail in data.email)
            //{
            //    SendEmail(smtp, _mailSettings.Mail, toEmail, data.title, builder);
            //}

            smtp.Disconnect(true);

        }


        public async Task SendEmailBirthday(BirthdayVM birthday)
        {
            for (int i = 0; i < birthday.email.Count; i++)
            {
                Console.WriteLine("Data Email: " + birthday.email[i]);
                var _email = new MimeMessage();
                _email.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail));
                //_email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
                _email.To.Add(MailboxAddress.Parse(birthday.email[i]));

                _email.Subject = "Happy Birthday " + birthday.name[i] + "!";
                var builder = new BodyBuilder();

                builder.HtmlBody = @"
                                 <!DOCTYPE html PUBLIC ""-//W3C//DTD XHTML 1.0 Strict//EN"" ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"">
                                        <html>

                                        <head>
                                          <!-- Compiled with Bootstrap Email version: 1.3.1 -->
                                          <meta http-equiv=""Content-Type"" content=""text/html; charset=utf-8"">
                                          <meta http-equiv=""x-ua-compatible"" content=""ie=edge"">
                                          <meta name=""x-apple-disable-message-reformatting"">
                                          <meta name=""viewport"" content=""width=device-width, initial-scale=1"">
                                          <meta name=""format-detection"" content=""telephone=no, date=no, address=no, email=no"">
                                          <style type=""text/css"">
                                            body,
                                            table,
                                            td {
                                              font-family: Helvetica, Arial, sans-serif !important
                                            }

                                            .ExternalClass {
                                              width: 100%
                                            }

                                            .ExternalClass,
                                            .ExternalClass p,
                                            .ExternalClass span,
                                            .ExternalClass font,
                                            .ExternalClass td,
                                            .ExternalClass div {
                                              line-height: 150%
                                            }

                                            a {
                                              text-decoration: none
                                            }

                                            * {
                                              color: inherit
                                            }

                                            a[x-apple-data-detectors],
                                            u+#body a,
                                            #MessageViewBody a {
                                              color: inherit;
                                              text-decoration: none;
                                              font-size: inherit;
                                              font-family: inherit;
                                              font-weight: inherit;
                                              line-height: inherit
                                            }

                                            img {
                                              -ms-interpolation-mode: bicubic
                                            }

                                            table:not([class^=s-]) {
                                              font-family: Helvetica, Arial, sans-serif;
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              border-spacing: 0px;
                                              border-collapse: collapse
                                            }

                                            table:not([class^=s-]) td {
                                              border-spacing: 0px;
                                              border-collapse: collapse
                                            }

                                            @media screen and (max-width: 600px) {

                                              .w-full,
                                              .w-full>tbody>tr>td {
                                                width: 100% !important
                                              }

                                              .w-24,
                                              .w-24>tbody>tr>td {
                                                width: 96px !important
                                              }

                                              .w-40,
                                              .w-40>tbody>tr>td {
                                                width: 160px !important
                                              }

                                              .p-lg-10:not(table),
                                              .p-lg-10:not(.btn)>tbody>tr>td,
                                              .p-lg-10.btn td a {
                                                padding: 0 !important
                                              }

                                              .p-3:not(table),
                                              .p-3:not(.btn)>tbody>tr>td,
                                              .p-3.btn td a {
                                                padding: 12px !important
                                              }

                                              .p-6:not(table),
                                              .p-6:not(.btn)>tbody>tr>td,
                                              .p-6.btn td a {
                                                padding: 24px !important
                                              }

                                              *[class*=s-lg-]>tbody>tr>td {
                                                font-size: 0 !important;
                                                line-height: 0 !important;
                                                height: 0 !important
                                              }

                                              .s-4>tbody>tr>td {
                                                font-size: 16px !important;
                                                line-height: 16px !important;
                                                height: 16px !important
                                              }

                                              .s-6>tbody>tr>td {
                                                font-size: 24px !important;
                                                line-height: 24px !important;
                                                height: 24px !important
                                              }

                                              .s-10>tbody>tr>td {
                                                font-size: 40px !important;
                                                line-height: 40px !important;
                                                height: 40px !important
                                              }
                                            }
                                          </style>
                                        </head>

                                        <body class=""bg-light""
                                          style=""outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;""
                                          bgcolor=""#f7fafc"">
                                          <table class=""bg-light body"" valign=""top"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                            style=""outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;""
                                            bgcolor=""#f7fafc"">
                                            <tbody>
                                              <tr>
                                                <td valign=""top"" style=""line-height: 24px; font-size: 16px; margin: 0;"" align=""left"" bgcolor=""#f7fafc"">
                                                  <table class=""container"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""width: 100%;"">
                                                    <tbody>
                                                      <tr>
                                                        <td align=""center"" style=""line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;"">
                                                          <!--[if (gte mso 9)|(IE)]>
                                                              <table align=""center"" role=""presentation"">
                                                                <tbody>
                                                                  <tr>
                                                                    <td width=""600"">
                                                            <![endif]-->
                                                          <table align=""center"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                            style=""width: 100%; max-width: 600px; margin: 0 auto;"">
                                                            <tbody>
                                                              <tr>
                                                                <td style=""line-height: 24px; font-size: 16px; margin: 0;"" align=""left"">
                                                                  <table class=""s-10 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                    style=""width: 100%;"" width=""100%"">
                                                                    <tbody>
                                                                      <tr>
                                                                        <td style=""line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;""
                                                                          align=""left"" width=""100%"" height=""40"">
                                                                          &#160;
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                  <!-- <table class=""ax-center"" role=""presentation"" align=""center"" border=""0"" cellpadding=""0""
                                                                    cellspacing=""0"" style=""margin: 0 auto;"">
                                                                    <tbody>
                                                                      <tr>
                                                                        <td style=""line-height: 24px; font-size: 16px; margin: 0;"" align=""left"">
                                                                          <!-- <img class=""w-24"" src=""https://www.berca.co.id/wp-content/uploads/2019/09/logo_berca1.png"" style =""height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; width: 300px; border-style: none; border-width: 0;""
                                                                            width=""96""> -->
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table> -->
                                                                  <table class=""card p-6 p - lg - 10 space - y - 4"" role=""presentation"" border=""0"" cellpadding=""0""
                                                           cellspacing = ""0""
                                                           style = ""border-radius: 6px; border-collapse: separate !important; width: 100%; overflow: hidden; border: 1px solid #e2e8f0;""
                                                           bgcolor = ""#ffffff"" >
                                                        <tbody>
                                                            <tr>
                                                                <td style = ""line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 40px;""
                                                                    align = ""left"" bgcolor = ""#ffffff"" >
                                                                    <center>
                                                                        <!-- <img class=""w-24"" src=""https://i.postimg.cc/NjXnXhKd/Pngtree-happy-birthday-vector-text-art-6498386.png"" style=""height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; width: 300px; border-style: none; border-width: 0;"" width=""96""> -->
                                                                        <p align = ""center"" id=""birthdayName"" style=""font-size: 20pt; font-family: Pristina""><b>“Happy Birthday " + birthday.name[i] + @" ”</b></p>
                                                                    </center>
                                                                    <br />

                                                                    <p style=""line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                       align=""center"">
                                                                        Selamat ulang tahun! Semoga Tuhan mengisi setiap momen di hari istimewa ini dengan kegembiraan, kekuatan, dan cinta!
                                                                    </p>

                                                                    <br />

                                                                    <p class=""style="" line-height: 24px; font-size: 16px; width: 100%; margin: 0;""
                                                                       align=""center"">
                                                                        Salam Hangat<br>
                                                                        RAS Department
                                                                    </p>

                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                                  <table class=""s-10 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                    style=""width: 100%;"" width=""100%"">
                                                                    <tbody>
                                                                      <tr>
                                                                        <td style=""line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;""
                                                                          align=""left"" width=""100%"" height=""40"">
                                                                          &#160;
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>

                                                                  <table class=""s-6 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                    style=""width: 100%;"" width=""100%"">
                                                                    <tbody>
                                                                      <tr>
                                                                        <td style=""line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;""
                                                                          align=""left"" width=""100%"" height=""24"">
                                                                          &#160;
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                  <div class=""text-muted text-center"" style=""color: #718096;"" align=""center"">
                                                                    Sent with &#10084; from RAS Management. <br>
                                                                    Jl. Abdul Muis No.62 <br>
                                                                    Gambir, Kota Jakarta Pusat, DKI Jakarta 10160.<br>
                                                                  </div>
                                                                  <table class=""s-6 w-full"" role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""
                                                                    style=""width: 100%;"" width=""100%"">
                                                                    <tbody>
                                                                      <tr>
                                                                        <td style=""line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;""
                                                                          align=""left"" width=""100%"" height=""24"">
                                                                          &#160;
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                          <!--[if (gte mso 9)|(IE)]>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                            <![endif]-->
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </body>

                                        </html>
                                   ";
                _email.Body = builder.ToMessageBody();

                using var smtp = new SmtpClient();
                smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);

                await smtp.SendAsync(_email);

                smtp.Disconnect(true);
            }

        }


        public void SendEmail(SmtpClient smtp, string fromEmail, string toEmail, string subject, BodyBuilder body)
        {
            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(fromEmail);
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;
            email.Body = body.ToMessageBody();

            smtp.Send(email);
        }

    }

}