using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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

            bool clientExists = await clientNameRepository.ClientNameIsExist(inputModel.NameOfClient);

            if (clientExists)
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Department Already Exists." });
            }

            var result = await clientNameRepository.AddClient(inputModel.NameOfClient);

            return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Di Tambahkan", Data = result });
        }

        [HttpPut("ChangeData")]
        public async Task<ActionResult> ChangeData([FromBody] ClientNameInputModel inputModel)
        {
            if (inputModel == null || string.IsNullOrWhiteSpace(inputModel.NameOfClient))
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Data Kosong atau Mengandung Spasi", Data = inputModel });
            }

            bool clientExists = await clientNameRepository.ClientNameIsExist(inputModel.NameOfClient);

            if (clientExists)
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Client Already Exists." });
            }

            var result = await clientNameRepository.ChangeName(inputModel.NameOfClient, inputModel.Id);

            return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Di Tambahkan", Data = result });
        }
    }

    public class ClientNameInputModel
    {
        public string NameOfClient { get; set; }
        public int Id { get; set; }
    }
}

