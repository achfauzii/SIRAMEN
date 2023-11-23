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
                var nextRunTime = new DateTime(now.Year, now.Month, now.Day, 9, 0, 0);
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
                    string apiEndpoint = "http://202.69.99.67:9001/api/Accounts/BirthDay";

                    using (HttpClient client = new HttpClient())
                    {
                        try
                        {
                            HttpResponseMessage response = await client.GetAsync(apiEndpoint);                           
                            if (response.IsSuccessStatusCode)
                            {
                                string responseData = await response.Content.ReadAsStringAsync();
                                Console.WriteLine($"API Response: {responseData}");

                                var userData = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(responseData);

                                var birthdayData = new BirthdayVM
                                {
                                    email = userData.data.email.ToObject<List<string>>(),
                                    name = userData.data.name.ToObject<List<string>>(),
                                };

                                //Send Email
                                await mailService.SendEmailBirthday(birthdayData);
                            }
                            else
                            {
                                Console.WriteLine($"API Request failed with status code: {response.StatusCode}");
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error: {ex.Message}");
                        }
                    }
                    await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
                }
            }
        }        
    }
}
