using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers
{
    public class JobVacanciesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task <IActionResult> JobVacancy_Admin ()
        {
            return View();
        }
    }
}
