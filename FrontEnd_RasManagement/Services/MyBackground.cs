using FrontEnd_RasManagement.Models;

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
                // Calculate the delay until the next 9:00 AM
                var now = DateTime.Now;
<<<<<<< HEAD
                var nextRunTime = new DateTime(now.Year, now.Month, now.Day, 10, 0, 0);
=======
                var nextRunTime = new DateTime(now.Year, now.Month, now.Day, 9, 30, 0);
>>>>>>> Fayyad-Clone-Publish
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
                    string apiEndpoint = "http://192.168.25.243:9001/api/Accounts/BirthDay";

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
    }
}
