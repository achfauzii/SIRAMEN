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
   [Authorize(Roles = "Admin,Super_Admin,Sales,Manager,Trainer")]
    public class ClientNameController : BaseController<ClientName, ClientNameRepository, int>
    {
        private readonly ClientNameRepository clientNameRepository;

        public ClientNameController(ClientNameRepository clientNameRepository) : base(clientNameRepository)
        {
            this.clientNameRepository = clientNameRepository;
        }

        [HttpPost("AddValidasi")]
        public async Task<ActionResult> ClientName([FromBody] ClientNameInputModel inputModel)
        {
            if (inputModel == null || string.IsNullOrWhiteSpace(inputModel.NameOfClient))
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Data Kosong atau Mengandung Spasi", Data = inputModel });
            }
            //Validasi Jika Nama Client dan Nama sales sama
            bool clientExists = await clientNameRepository.ClientNameIsExist(inputModel.NameOfClient, inputModel.SalesName);

            if (clientExists)
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Client Already Exists." });
            }

            var result = await clientNameRepository.AddClient(inputModel);

            return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Di Tambahkan", Data = result });
        }

        [HttpPut("ChangeData")]
        public async Task<ActionResult> ChangeData([FromBody] ClientNameInputModel inputModel)
        {
            if (inputModel == null || string.IsNullOrWhiteSpace(inputModel.NameOfClient))
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Data Kosong atau Mengandung Spasi", Data = inputModel });
            }
            //Validasi Jika Nama Client dan Nama sales sama
            bool clientExists = await clientNameRepository.ClientNameIsExist(inputModel.NameOfClient, inputModel.SalesName);

            if (clientExists)
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Client Already Exists." });
            }

            var result = await clientNameRepository.ChangeName(inputModel.NameOfClient, inputModel.Id);

            return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Di Tambahkan", Data = result });
        }


        [HttpGet("ClientNameWithStatusOnsite")]
        public async Task<IActionResult> GetClientStatusOnsite()
        {
            var result = await clientNameRepository.GetClientStatusOnsite();
            return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Di Temukan", Data = result });
        }

        [AllowAnonymous]
        [HttpGet("Requirement")]
        public async Task<IActionResult> GetClientRequirement()
        {
            var result = await clientNameRepository.ggg();
            return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Di Temukan", Data = result });
        }

        [AllowAnonymous]
        [HttpGet("FilterByMostClients")]
        public async Task<IActionResult> GetByMostClients()
        {
            var result = await clientNameRepository.GetByMostClients();
            return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Di Temukan", Data = result });
        }

    }

    public class ClientNameInputModel
    {
        public string? NameOfClient { get; set; }

        public string? SalesName { get; set; }
        public string? SalesContact { get; set; }
        public string? ClientContact { get; set; }
        public string? PicClient { get; set; }
        public int Id { get; set; }

        public string? CompanyOrigin { get; set; }
        public string? Authority { get; set; }
        public string? Industry { get; set; }
    }
}

