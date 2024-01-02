﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Interface;
using RasManagement.Repository;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin,Super_Admin")]
    public class ShortlistController : BaseController<NonRasCandidate, ShortlistRepository, int>
    {
        private readonly ShortlistRepository shortlistRepository;
        private readonly ProjectRasmanagementContext _context;
        public ShortlistController(ShortlistRepository shortlistRepository, ProjectRasmanagementContext context) : base(shortlistRepository)
        {
            this.shortlistRepository = shortlistRepository;
            _context = context;
        }

        [HttpGet("Position")]
        public async Task<IActionResult> Position()
        {
            var uniquePositions = await _context.NonRasCandidates
                                         .Select(c => c.Position)
                                         .Distinct()
                                         .ToListAsync();

            var cleaningPositions = uniquePositions
            .SelectMany(position => position.Split(',').Select(p => p.Trim()))
            .Select(position => position)
            .Distinct()
            .ToList();
            if (uniquePositions != null)
            {
                return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data ditemukan", Data = cleaningPositions });
            }
            else
            {
                return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data not found" });
            }

        }


        /*     [HttpPut("UpdateNonRAS")]
             public IActionResult UpdateNonRAS(NonRasCandidate nonRasCandidate)
             {
                 var get = shortlistRepository.UpdateNonRAS(nonRasCandidate);
                 if (get != null)
                 {
                     return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data berhasil diubah", Data = get });
                 }
                 else
                 {
                     return StatusCode(404, new { status = HttpStatusCode.NotFound, message = "Data tidak bisa diubah", Data = get });
                 }
             }*/

        [HttpPost("NonRasDatatable")]
        public async Task<IActionResult> GetData([FromBody] DataTablesRequest request)
        {
            //var employees = await employeeRepository.GetEmployeeData();
            var query = _context.NonRasCandidates.AsQueryable();





            // Implementasi pencarian
            if (!string.IsNullOrEmpty(request.Search?.Value))
            {
                var searchTerm = request.Search.Value.ToLower();
                query = query.Where(e =>
                    e.Fullname.ToLower().Contains(searchTerm) || // Ganti dengan kolom yang ingin dicari 
                    e.Position.ToLower().Contains(searchTerm) ||
                    e.Skillset.ToLower().Contains(searchTerm)

                );
            }

            if (!string.IsNullOrEmpty(request.Search?.Category))
            {
                var category = request.Search.Category.ToLower();
                query = query.Where(e =>

                    e.Position.ToLower().Contains(category)
                );

                if (!string.IsNullOrEmpty(request.Search?.Value))
                {
                    var searchTerm = request.Search.Value.ToLower();
                    query = query.Where(e =>
                        e.Fullname.ToLower().Contains(searchTerm) ||
                        e.Position.ToLower().Contains(category)
                    );
                }
            }


            var sortColumnIndex = request.Order.column;
            var sortDirection = request.Order.dir;
            if (sortColumnIndex == 0)
            {
                query = sortDirection == "asc" ? query.OrderBy(c => c.Fullname) : query.OrderByDescending(c => c.Fullname);
            }
            else if (sortColumnIndex == 1)
            {
                query = sortDirection == "asc" ? query.OrderBy(c => c.Position) : query.OrderByDescending(c => c.Position);
            }

            else
            {
                query = sortDirection == "asc" ? query.OrderBy(c => c.Fullname) : query.OrderByDescending(c => c.Fullname);
            }

            var shortList = await query.ToListAsync();

            var displayResult = shortList.Skip(request.Start)
                .Take(request.Length).ToList();

            var response = new DataTablesResponse
            {
                Draw = request.Draw,
                RecordsTotal = shortList.Count(),
                RecordsFiltered = shortList.Count(), // Count total
                Data = displayResult// Data hasil 
            };

            return Ok(response);
        }

        [HttpPost("Add")]
        public virtual ActionResult Add(NonRasCandidate nonRasCandidate)
        {
            var insert = shortlistRepository.Add(nonRasCandidate);
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

        [AllowAnonymous]
        [HttpPost("ShortListCandidate")]
        public async Task<IActionResult> GetDataShared([FromBody] DataTablesRequest request)
        {
            //var employees = await employeeRepository.GetEmployeeData();
            var query = _context.NonRasCandidates.AsQueryable();
            // Filter berdasarkan kategori (Category)



            // Implementasi pencarian
            if (!string.IsNullOrEmpty(request.Search?.Value))
            {
                var searchTerm = request.Search.Value.ToLower();
                query = query.Where(e =>
                    e.Fullname.ToLower().Contains(searchTerm) || // Ganti dengan kolom yang ingin dicari 
                    e.Position.ToLower().Contains(searchTerm) ||
                      e.Skillset.ToLower().Contains(searchTerm)
                );
            }

            if (!string.IsNullOrEmpty(request.Search?.Category))
            {
                var category = request.Search.Category.ToLower();
                query = query.Where(e =>

                    e.Position.ToLower().Contains(category)
                );

                if (!string.IsNullOrEmpty(request.Search?.Value))
                {
                    var searchTerm = request.Search.Value.ToLower();
                    query = query.Where(e =>
                        e.Fullname.ToLower().Contains(searchTerm) ||
                        e.Position.ToLower().Contains(category) ||
                        e.Skillset.ToLower().Contains(category)
                    );
                }
            }

            var sortColumnIndex = request.Order.column;
            var sortDirection = request.Order.dir;
            if (sortColumnIndex == 0)
            {
                query = sortDirection == "asc" ? query.OrderBy(c => c.Fullname) : query.OrderByDescending(c => c.Fullname);
            }
            else if (sortColumnIndex == 1)
            {
                query = sortDirection == "asc" ? query.OrderBy(c => c.Position) : query.OrderByDescending(c => c.Position);
            }

            else
            {
                query = sortDirection == "asc" ? query.OrderBy(c => c.Fullname) : query.OrderByDescending(c => c.Fullname);
            }



            var shortList = await query.ToListAsync();
            var displayResult = shortList.Skip(request.Start)
                .Take(request.Length)
                .Select(e => new
                {

                    e.Fullname,
                    e.Position,
                    e.Skillset,
                    e.Education,
                    e.Ipk,
                    e.University,
                    e.Domisili,
                    e.Birthdate,
                    e.Level,
                    e.ExperienceInYear,
                    e.WorkStatus,
                    e.NoticePeriode,
                    e.FinancialIndustry,
                    e.CvBerca,
                    e.LevelRekom


                })
                .ToList();

            var response = new DataTablesResponse
            {
                Draw = request.Draw,
                RecordsTotal = shortList.Count(),
                RecordsFiltered = shortList.Count(), // Count total
                Data = displayResult// Data hasil 
            };

            return Ok(response);
        }
        [HttpGet("Statistic")]
        public async Task<IActionResult> Statistic(){
        var candidates = await _context.NonRasCandidates.ToListAsync();

    // Membuat dictionary untuk menyimpan jumlah kemunculan masing-masing skill
    var skillCounts = new Dictionary<string, int>();

    foreach (var candidate in candidates)
    {
        // Membagi string skill berdasarkan koma dan membersihkan whitespace
        var skills = candidate.Skillset?.Split(',').Select(skill => skill.Trim());

        // Menghitung jumlah kemunculan masing-masing skill
        foreach (var skill in skills)
        {
            if (string.IsNullOrEmpty(skill))
                continue;

            if (skillCounts.ContainsKey(skill))
                skillCounts[skill]++;
            else
                skillCounts[skill] = 1;
        }
    }

    var mostCommonPosition = _context.NonRasCandidates
    .GroupBy(c => c.Position)
    .OrderByDescending(group => group.Count())
    .Select(group => new
    {
        Position = group.Key,
        Count = group.Count()
    })
    .FirstOrDefault();

// Query untuk menghitung skillset
var mostCommonSkill = skillCounts
    .OrderByDescending(pair => pair.Value)
    .Select(pair => new
    {
        Skill = pair.Key,
        Count = pair.Value
    })
    .FirstOrDefault();

// Query untuk menghitung level
var mostCommonLevel = _context.NonRasCandidates
    .GroupBy(c => c.Level)
    .OrderByDescending(group => group.Count())
    .Select(group => new
    {
        Level = group.Key,
        Count = group.Count()
    })
    .FirstOrDefault();

// Membuat list hasil untuk dikirim sebagai response
var data = new List<object>
{
    new
    {
        Position = mostCommonPosition?.Position,
        Count = mostCommonPosition?.Count
    },
    new
    {
        Skill = mostCommonSkill?.Skill,
        Count = mostCommonSkill?.Count
    },
    new
    {
        Level = mostCommonLevel?.Level,
        Count = mostCommonLevel?.Count
    }
};

            return StatusCode(200,
                    new
                    {
                        status = HttpStatusCode.OK,
                        message = "Data Ditemukan",
                        Data = data
                    });
        }
    }
}