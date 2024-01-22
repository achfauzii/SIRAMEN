using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using Microsoft.AspNetCore.Authorization;
using RasManagement.Repository;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Employee,Admin,Super_Admin,Sales,Manager,Trainer")]
    public class DepartmentController : BaseController<Department, DepartmentRepository, int>
    {
        private readonly DepartmentRepository departmentRepository;

        public DepartmentController(DepartmentRepository departmentRepository) : base(departmentRepository)
        {
            this.departmentRepository = departmentRepository;
        }

        [HttpPost("Departmentv2")]
        public async Task<ActionResult> Department([FromBody] DepartmentInputModel inputModel)
        {
            if (inputModel == null || string.IsNullOrWhiteSpace(inputModel.NamaDept))
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Data Kosong atau Mengandung Spasi", Data = inputModel });
            }

            bool departmentExists = await departmentRepository.DepartmentIsExist(inputModel.NamaDept);

            if (departmentExists)
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Department Already Exists." });
            }

            var result = await departmentRepository.AddDepartment(inputModel.NamaDept);

            return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Di Tambahkan", Data = result });
        }
        [HttpPut("Departmentv2")]
        public async Task<ActionResult> UpdateDepartment([FromBody] Department inputModel)
        {
            if (inputModel == null || string.IsNullOrWhiteSpace(inputModel.NamaDept))
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Data Kosong atau Mengandung Spasi", Data = inputModel });
            }

            bool departmentExists = await departmentRepository.DepartmentIsExist(inputModel.NamaDept, inputModel.DeptId);

            if (departmentExists)
            {
                return StatusCode(200, new { status = HttpStatusCode.BadRequest, message = "Department Already Exists." });
            }

            var result = await departmentRepository.UpdateDepartment(inputModel.DeptId, inputModel.NamaDept);

            return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Di Diubah", Data = result });
        }
    }

    public class DepartmentInputModel
    {
        public string NamaDept { get; set; }
    }
}
