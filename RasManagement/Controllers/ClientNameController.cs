using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Super_Admin")]
    public class ClientNameController : BaseController<ClientName, ClientNameRepository, int>
    {
        private readonly ClientNameRepository clientNameRepository;

        public ClientNameController(ClientNameRepository clientNameRepository) : base(clientNameRepository)
        {
            this.clientNameRepository = clientNameRepository;
        }
    }
}
