using FrontEnd_RasManagement.Models;
using Newtonsoft.Json;
using System.Text;

namespace FrontEnd_RasManagement.Services
{
    public class MyBackground: BackgroundService
    {
        private readonly ILogger<MyBackground> _logger;
        private readonly IMailService mailService;
        public MyBackground(ILogger<MyBackground> logger, IMailService mailService)
        {
            _logger = logger;
            this.mailService = mailService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                // Calculate the delay until the next 9:30 AM
                var now = DateTime.Now;
                var nextRunTime = new DateTime(now.Year, now.Month, now.Day, 10, 15, 0);
                if (now > nextRunTime)
                {
                    nextRunTime = nextRunTime.AddDays(1);
                }

                var delay = nextRunTime - now;
                // Initial delay before the first execution
                await Task.Delay(delay, stoppingToken);

                while (!stoppingToken.IsCancellationRequested)
                {
                    _logger.LogInformation("Background task is running...");
                    string apiEndpoint = "https://localhost:7177/api/Accounts/BirthDay";

                    using (HttpClient client = new HttpClient())
                    {
                        try
                        {
                            _logger.LogInformation("Get Birthday API");
                            HttpResponseMessage response = await client.GetAsync(apiEndpoint);
                            if (response.IsSuccessStatusCode)
                            {
                                _logger.LogInformation("Get Birthday API Success...");
                                string responseData = await response.Content.ReadAsStringAsync();
                                Console.WriteLine($"API Response: {responseData}");

                                var userData = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(responseData);

                                var birthdayData = new BirthdayVM
                                {
                                    email = userData.data.email.ToObject<List<string>>(),
                                    name = userData.data.name.ToObject<List<string>>(),
                                };

                                //Send Email
                                _logger.LogInformation("Send Birthday Email...");
                                await mailService.SendEmailBirthday(birthdayData);
                            }
                            else
                            {
                                _logger.LogError("Get Birthday API Failed..");
                                Console.WriteLine($"API Request failed with status code: {response.StatusCode}");
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError("Send Email Failed..");
                            _logger.LogError($"ERROR: {ex.Message}");
                            Console.WriteLine($"Error: {ex.Message}");
                        }
                    }
                    await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
                }
            }
        }



        //protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        //{
        //    while (!stoppingToken.IsCancellationRequested)
        //    {
        //        // Calculate the delay until the next 9:15 AM
        //        var now = DateTime.Now;
        //        var nextRunTime = new DateTime(now.Year, now.Month, now.Day, 9, 15, 0);
        //        if (now > nextRunTime)
        //        {
        //            nextRunTime = nextRunTime.AddDays(1);
        //        }

        //        var delay = nextRunTime - now;
        //        // Initial delay before the first execution
        //        await Task.Delay(delay, stoppingToken);

        //        while (!stoppingToken.IsCancellationRequested)
        //        {
        //            _logger.LogInformation("Background task is running...");
        //            string apiEndpoint = "https://localhost:7177/api/Accounts/BirthDay";

        //            using (HttpClient client = new HttpClient())
        //            {
        //                try
        //                {
        //                    _logger.LogInformation("Get Birthday API");
        //                    HttpResponseMessage response = await client.GetAsync(apiEndpoint);
        //                    if (response.IsSuccessStatusCode)
        //                    {
        //                        _logger.LogInformation("Get Birthday API Success...");
        //                        string responseData = await response.Content.ReadAsStringAsync();
        //                        _logger.LogInformation($"API Response: {responseData}");

        //                        var userData = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(responseData);

        //                        var birthdayData = new BirthdayVM
        //                        {
        //                            email = userData.data.email.ToObject<List<string>>(),
        //                            name = userData.data.name.ToObject<List<string>>(),
        //                        };

        //                        //Send Email
        //                        _logger.LogInformation("Send Birthday Email...");
        //                        await mailService.SendEmailBirthday(birthdayData);
        //                    }
        //                    else
        //                    {
        //                        _logger.LogError("Get Birthday API Failed..");
        //                        _logger.LogError($"API Request failed with status code: {response.StatusCode}");
        //                    }
        //                }
        //                catch (Exception ex)
        //                {
        //                    _logger.LogError(ex, "An error occurred while processing birthday API or sending email");
        //                }
        //            }

        //            // Calculate the next execution time
        //            now = DateTime.Now;
        //            nextRunTime = new DateTime(now.Year, now.Month, now.Day, 9, 15, 0).AddDays(1);
        //            delay = nextRunTime - now;

        //            // Delay until the next execution
        //            await Task.Delay(delay, stoppingToken);
        //        }
        //    }
        //}


    }


    public class TimesheetBackgroundSendEmail : BackgroundService
    {
        private readonly ILogger<TimesheetBackgroundSendEmail> _logger;

        private readonly IMailService mailService;
        public TimesheetBackgroundSendEmail(ILogger<TimesheetBackgroundSendEmail> logger, IMailService mailService)
        {
            _logger = logger;
            this.mailService = mailService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {

                var now = DateTime.Now;
                var nextRunTime = new DateTime(now.Year, now.Month, 28, 10, 0, 0);

                if (now > nextRunTime)
                {
                    nextRunTime = nextRunTime.AddMonths(1);
                }

                var delay = nextRunTime - now;

                await Task.Delay(delay, stoppingToken);

                while (!stoppingToken.IsCancellationRequested)
                {
                    _logger.LogInformation("Background task Timesheet is running...");
                    string apiEndpoint = "https://localhost:7177/api/EmployeePlacements/EmpOnsite?kode=RasMgmt2024";

                    using (HttpClient client = new HttpClient())
                    {
                        try
                        {

                            _logger.LogInformation("Get Placement Onsite");
                            var postData = new StringContent("kode=RasMgmt2024", Encoding.UTF8, "application/x-www-form-urlencoded");

                       
                            HttpResponseMessage response = await client.PostAsync(apiEndpoint, postData);
                            if (response.IsSuccessStatusCode)
                            {
                                _logger.LogInformation("Get API Success...");
                                string responseData = await response.Content.ReadAsStringAsync();
                                Console.WriteLine($"API Response: {responseData}");
                                var responseObject = JsonConvert.DeserializeObject<dynamic>(responseData);

                                var resultList = responseObject.data.result;
                                var emailList = new List<string>();
                                var fullnameList = new List<string>();

                                foreach (var result in resultList)
                                {
                                    emailList.Add(result.email.ToString());
                                    fullnameList.Add(result.fullname.ToString());
                                }

                                var employeeData = new EmployeeData
                                {
                                    Email = emailList,
                                    Fullname = fullnameList
                                };

                          
                                _logger.LogInformation("Send Notif Timesheet Email...");
                                await mailService.SendEmailNotifTimesheet(employeeData);

                            }
                            else
                            {
                                _logger.LogError("Get Timesheet API Failed..");
                                Console.WriteLine($"API Request failed with status code: {response.StatusCode}");
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError("Send Email Failed..");
                            _logger.LogError($"ERROR: {ex.Message}");
                            Console.WriteLine($"Error: {ex.Message}");
                        }
                    }
                    await Task.Delay(TimeSpan.FromHours(24), stoppingToken);

                }
            }
        }
    }
}
