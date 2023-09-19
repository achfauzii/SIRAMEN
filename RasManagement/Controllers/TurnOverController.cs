﻿using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;
using System.Net;

namespace RasManagement.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class TurnOverController : BaseController<TurnOver, TurnOverRepository, int>
    {
        private readonly TurnOverRepository turnOverRepository;
        public TurnOverController(TurnOverRepository turnOverRepository) : base(turnOverRepository)
        {
            this.turnOverRepository = turnOverRepository;
        }

        [HttpGet("TurnOverEmployee")]
        public async Task<IActionResult> TurnOverEmployee()
        {
            var get = await turnOverRepository.GetTurnOverEmployee();
            if (get.Count() >= 0)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = get.Count() + " Data Ditemukan", TotalData = get.Count(), Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = get.Count() + " Data Ditemukan", Data = get });
            }
        }

    }

}
