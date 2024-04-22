using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers.Share
{
    public class ShareController : Controller
    {
        // [AllowAnonymous]
        public IActionResult ShortlistCandidate()
        {
            return View();
        }

        [AllowAnonymous]
        public IActionResult GenerateCvShared()
        {
    
            return View();
        }
    }
}
