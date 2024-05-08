﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Employee,Admin,Super_Admin,Sales,Manager,Trainer")]
    public class SalesProjectionController : BaseController<SalesProjection, SalesProjectionRepository,int>
    {

        private readonly SalesProjectionRepository salesProjectionRepository;
        public SalesProjectionController(SalesProjectionRepository salesProjectionRepository) : base(salesProjectionRepository)
        {
            this.salesProjectionRepository = salesProjectionRepository; ;
        }

        [HttpGet("byStatus")]
        public async Task<IActionResult> GetSalesProjectionByProjectionStatus(string status)
        {
            var get = await salesProjectionRepository.GetByProjectionStatus(status);
            if (get.Count != 0)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = get });
            }
            else
            {
                return StatusCode(200, new { status = HttpStatusCode.NotFound, message = "Data not found", Data = get });
            }
        }
    }
}
