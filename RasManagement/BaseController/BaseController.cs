using RasManagement.Interface;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using RasManagement.Interface;

namespace RasManagement.BaseController
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController<Entity, Repository, Key> : ControllerBase
        where Entity : class
        where Repository : GeneralInterface<Entity, Key>
    {
        private readonly Repository repository;
        public BaseController(Repository repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public virtual ActionResult Get()
        {
            var get = repository.Get();
            if (get.Count() >= 0)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = get.Count() + " Data Ditemukan", Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = get.Count() + " Data Ditemukan", Data = get });
            }
        }

        [HttpGet("{key}")]
        public virtual ActionResult get(Key key)
        {
            var get = repository.get(key);
            if (get != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Ditemukan", Data = get });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data Tidak Ditemukan", Data = get });
            }
        }

        [HttpPost]
        public virtual ActionResult Insert(Entity entity)
        {
            var insert = repository.Insert(entity);
            if (insert >= 1)
            {
                return StatusCode(200,
                    new
                    {
                        status = HttpStatusCode.OK,
                        message = "Data Berhasil Dimasukkan",
                        Data = insert
                    });
            }
            else
            {
                return StatusCode(500,
                    new
                    {
                        status = HttpStatusCode.InternalServerError,
                        message = "Gagal Memasukkan Data",
                        Data = insert
                    });
            }
        }

        [HttpPut]
        public virtual ActionResult Update(Entity entity)
        {
            var insert = repository.Update(entity);
            if (insert >= 1)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Diperbaharui", Data = insert });
            }
            else
            {
                return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Gagal Memperbaharui Data", Data = insert });
            }
        }

        [HttpDelete("{key}")]
        public ActionResult Delete(Key key)
        {
            var delete = repository.Delete(key);
            if (delete >= 1)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Dihapus", Data = delete });
            }
            else if (delete == 0)
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data dengan Id " + key + "Tidak Ditemukan", Data = delete });
            }
            else
            {
                return StatusCode(500, new { status = HttpStatusCode.InternalServerError, message = "Terjadi Kesalahan", Data = delete });
            }
        }

    }
}