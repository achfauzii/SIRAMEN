﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : BaseController<Department, DepartmentRepository, int>
    {
        private readonly DepartmentRepository departmentRepository;
        public DepartmentController(DepartmentRepository departmentRepository) : base(departmentRepository)
        {
            this.departmentRepository = departmentRepository;
        }
    }
}