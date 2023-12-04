using FrontEnd_RasManagement.Models;
using FrontEnd_RasManagement.Services;
using Microsoft.AspNetCore.Mvc;

using System;
using System.Net;

namespace FrontEnd_RasManagement.Controllers
{
    public class AnnounceController : Controller
    {
        private readonly IMailService mailService;
        public AnnounceController(IMailService mailService)
        {

            this.mailService = mailService;
        }

        // GET: HomeController1
        public ActionResult Index()
        {
            return View();
        }

        // GET: HomeController1/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: HomeController1/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: HomeController1/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: HomeController1/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: HomeController1/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: HomeController1/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: HomeController1/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        [HttpPost]
        public async Task<IActionResult> SendEmailKelahiran([FromBody] KelahiranVM request)
        {
            try
            {
                await mailService.SendEmailBeritaKelahiran(request);

                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Email has been sent" });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Email gagal dikirim!" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> SendEmailDukaCita([FromBody] DukaCitaVM request)
        {
            try
            {
                await mailService.SendEmailBeritaDukaCita(request);

                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Email has been sent" });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Email gagal dikirim!" });
            }
        }




        [HttpPost]
        public async Task<IActionResult> SendEmailBirthDay([FromBody] BirthdayVM request)
        {
            try
            {
                await mailService.SendEmailBirthday(request);
                return Ok();
            }
            catch (Exception ex)
            {
                // Tangani kesalahan yang terjadi, kembalikan view yang diinginkan dengan pesan kesalahan
                ViewBag.ErrorMessage = $"An error occurred: {ex.Message}";
                return View("Error");
            }
        }


    }
}
