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
    [Authorize(Roles = "Employee,Admin,Super_Admin,Trainer,Manager")]
    public class EmployeePlacementsController : ControllerBase
    {
        private readonly EmployeePlacementRepository employeePlacementRepository;


        public EmployeePlacementsController(EmployeePlacementRepository employeePlacementRepository)
        {
            this.employeePlacementRepository = employeePlacementRepository;
        }

        // GET api/<EmployeePlacementsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        [HttpGet]
        
        public async Task<ActionResult> Get()
        {

            var data = await employeePlacementRepository.Get();

            if (data != null)
            {

                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil di tambahkan", Data = data });

            }
            else
            {
                return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Placment gagal ditambahkan" });
            }


        }

        // POST api/<EmployeePlacementsController>
        [HttpPost]
        public async Task<ActionResult> AddPlacement(PlacementVM placementVM)
        {

            var data = await employeePlacementRepository.AddPlacement(placementVM);

            if (data >= 1)
            {

                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil di tambahkan", Data = data });

            }
            else
            {
                return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Placement gagal ditambahkan" });
            }


        }

        [HttpPost("TurnOver")]
        public async Task<ActionResult> AddTurnOver(TurnOverVM turnOverVM)
        {

            var data = await employeePlacementRepository.AddTurnOver(turnOverVM);

            if (data >= 1)
            {

                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil di tambahkan", Data = data });

            }
            else
            {
                return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Placment gagal ditambahkan" });
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

        [HttpGet("PlacementID")]
        public IActionResult GetById(int placementStatusId)
        {
            var get = employeePlacementRepository.GetPlacementId(placementStatusId);
            if (get != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data not found", Data = get });
            }
        }

        [AllowAnonymous]
        [HttpPost("EmpOnsite")]
        public IActionResult GetEmployeesOnsite( string kode)
        {

            if (kode == "RasMgmt2024")
            {
                var get = employeePlacementRepository.GetEmployeeOnsite();
                if (get != null)
                {
                    return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = get });
                }
                else
                {
                    return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data not found", Data = get });
                }
            }
            else
            {
                return StatusCode(403, new { status = HttpStatusCode.Forbidden, message = "Failed to Access" });
            }
           
        }



        [HttpPut]
        public async Task<IActionResult> UpdatePlacement(PlacementVM placementVM)
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

        [HttpGet("GetStatusEmp")]
        
        public async Task<ActionResult> GetStatusEmp()
        {
            
                var data = await employeePlacementRepository.GetStatusEmp();

                if (data != null)
                {

                    return StatusCode(200, new
                    {
                        status = HttpStatusCode.OK,
                        message = "Data ditemukan ",
                        Data = data
                    });

                }
                else
                {
                    return StatusCode(404, new
                    {
                        status = HttpStatusCode.NotFound,
                        message = "Not Found"
                    });
                }
            
            
          
        }


    }
}
