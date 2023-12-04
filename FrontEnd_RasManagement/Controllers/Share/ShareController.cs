using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers.Share
{
    public class ShareController : Controller
    {
        public IActionResult ShortlistCandidate()
        {
            return View();
        }
    }
}
