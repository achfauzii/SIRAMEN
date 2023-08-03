﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RasManagement.Repository;
using RasManagement.ViewModel;
using System.Net;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Employee,Admin,Super_Admin")]
    public class EmployeePlacementsController : ControllerBase
    {
        private readonly EmployeePlacementRepository employeePlacementRepository;


        public EmployeePlacementsController(EmployeePlacementRepository employeePlacementRepository) 
        {
            this.employeePlacementRepository = employeePlacementRepository;
        }
        // GET: api/<EmployeePlacementsController>
        [HttpGet]   
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<EmployeePlacementsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<EmployeePlacementsController>
        [HttpPost]
        public async Task <ActionResult> AddPlacement(PlacementVM placementVM)
        {

            bool accountIdExists = await employeePlacementRepository.AccountIsExist(placementVM.AccountId);
           
            if (accountIdExists !=true)
            {
                var data = await employeePlacementRepository.AddPlacement(placementVM);
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil di tambahkan", Data = data });

            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Placment sudah di tambahkan" });
            }


        }

        // PUT api/<EmployeePlacementsController>/5
        [HttpGet("accountId")]
        public IActionResult EmployeePlacement(string accountId)
        {
            var get = employeePlacementRepository.GetAccount(accountId);
            if (get != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data not found", Data = get });
            }
        }

        [HttpPut]
        public async Task <IActionResult> UpdatePlacement(PlacementVM placementVM)
        {
            var update = await employeePlacementRepository.UpdatePlacement(placementVM);
            if (update >= 1)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil di perbarui", Data = update });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data gagal di perbaharurui" });
            }
        }

        // DELETE api/<EmployeePlacementsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
