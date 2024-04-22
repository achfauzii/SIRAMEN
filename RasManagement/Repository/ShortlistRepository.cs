using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Org.BouncyCastle.Pqc.Crypto.Lms;
using RasManagement.Interface;
using RasManagement.Models;
using RasManagement.ViewModel;

namespace RasManagement.Repository
{
    public class ShortlistRepository : GeneralRepository<ProjectRasmanagementContext, NonRasCandidate, int>
    {
        private readonly ProjectRasmanagementContext _context;

        public ShortlistRepository(ProjectRasmanagementContext context) : base(context)
        {
            this._context = context;
        }

        public string GenerateNonId()
        {
            //var currentDate = DateTime.Now.ToString("ddMMyyy");
            int countNonRas = _context.NonRasCandidates.Count();
            /* var lastEmployee = myContext.Employees
                 .OrderByDescending(e => e.NIK)
                 .FirstOrDefault();*/
            var ras = "NonRAS";
            if (countNonRas == 0)
            {
                // Jika belum ada data sama sekali, maka ID dimulai dari 0
                //return DateTime.Now.ToString("ddMMyyyy") + "000";
                return ras + "001";
            }
            return $"{ras}{countNonRas + 1:D3}";
        }

        public List<SharedShortListVM> GetSharedShortList()
        {
            var employees = _context.Accounts
                .Include(a => a.FormalEdus)
                .Include(a => a.Placements)
                .Include(a => a.Qualifications)
                .Where(a => a.RoleId == "3")
                .Select(emp => new SharedShortListVM
                {
                    AccountId = emp.AccountId,
                    Fullname = emp.Fullname,
                    Position = emp.Position ?? "",
                    Skillset = emp.Qualifications.Count != 0 ? emp.Qualifications.ToList()[emp.Qualifications.Count - 1].Framework
                            + emp.Qualifications.ToList()[emp.Qualifications.Count - 1].ProgrammingLanguage
                            + emp.Qualifications.ToList()[emp.Qualifications.Count - 1].Database
                            + emp.Qualifications.ToList()[emp.Qualifications.Count - 1].Tools : "",
                    Level = emp.Level,
                    Education = emp.FormalEdus.Count != 0 ? emp.FormalEdus.ToList()[emp.FormalEdus.Count - 1].Degree + " - " +
                            emp.FormalEdus.ToList()[emp.FormalEdus.Count - 1].Major : "",
                    Ipk = emp.FormalEdus.Count != 0 ? emp.FormalEdus.ToList()[emp.FormalEdus.Count - 1].Ipk : "",
                    University = emp.FormalEdus.Count != 0 ? emp.FormalEdus.ToList()[emp.FormalEdus.Count - 1].UniversityName : "",
                    Age = emp.Birthdate != null ? DateTime.Now.Year - emp.Birthdate.Value.Year + " Years Old" : "",
                    WorkStatus = emp.Placements.Count != 0 ? emp.Placements.ToList()[emp.Placements.Count - 1].PlacementStatus : "Idle",
                    endDate = emp.Placements.Count != 0 ? emp.Placements.ToList()[emp.Placements.Count - 1].EndDate : null,
                    NoticePeriode = null,
                    FinancialIndustry = emp.FinancialIndustry,
                    CvBerca = "cvberca"
                }).ToList();

            var nonras = _context.NonRasCandidates
                .Where(f => f.isDeleted != true && (f.CvBerca != null && f.CvBerca != ""))
                .Select(non => new SharedShortListVM
                {
                    NonRAS_Id = non.NonRasId != null ? non.NonRasId : 0,
                    Fullname = non.Fullname != null ? non.Fullname : "",
                    Position = non.Position != null ? non.Position : "",
                    Skillset = non.Skillset != null ? non.Skillset : "",
                    Level = non.Level != null ? non.Level : "",
                    Education = non.Education != null ? non.Education : "",
                    Ipk = non.Ipk != null ? non.Ipk : "",
                    University = non.University != null ? non.University : "",
                    Age = non.Birthdate != null ? non.Birthdate + " Years Old" : "",
                    ExperienceInYear = non.ExperienceInYear != null ? non.ExperienceInYear : "",
                    WorkStatus = non.WorkStatus != null ? non.WorkStatus : "",
                    NoticePeriode = non.NoticePeriode != null ? non.NoticePeriode : "",
                    FinancialIndustry = non.FinancialIndustry != null ? non.FinancialIndustry : "",
                    CvBerca = non.CvBerca != null ? non.CvBerca : ""
                }).ToList();

            List<SharedShortListVM> sharedShortLists = new List<SharedShortListVM>();
            sharedShortLists.AddRange(employees);
            sharedShortLists.AddRange(nonras);

            return sharedShortLists;
        }

        /*public List<SharedShortListVM> GetSharedShortList()
        {// Possible null reference argument.
            var employees = _context.Accounts
                    .Include(a => a.FormalEdus).Include(a => a.Placements).Include(a => a.Qualifications)
                    .Where(a => a.RoleId == "3")
                    .Select(emp => new SharedShortListVM
                    {
                        AccountId = emp.AccountId,
                        Fullname = emp.Fullname,
                        Position = emp.Position ?? "",
                        Skillset = emp.Qualifications.Count != 0 ? emp.Qualifications.ToList()[emp.Qualifications.Count - 1].Framework
                                + emp.Qualifications.ToList()[emp.Qualifications.Count - 1].ProgrammingLanguage
                                + emp.Qualifications.ToList()[emp.Qualifications.Count - 1].Database
                                + emp.Qualifications.ToList()[emp.Qualifications.Count - 1].Tools : "",
                        Level = emp.Level,
                        Education = emp.FormalEdus.Count != 0 ? emp.FormalEdus.ToList()[emp.FormalEdus.Count - 1].Degree + " - " +
                                emp.FormalEdus.ToList()[emp.FormalEdus.Count - 1].Major : "",
                        Ipk = emp.FormalEdus.Count != 0 ? emp.FormalEdus.ToList()[emp.FormalEdus.Count - 1].Ipk : "",
                        University = emp.FormalEdus.Count != 0 ? emp.FormalEdus.ToList()[emp.FormalEdus.Count - 1].UniversityName : "",
                        Age = emp.Birthdate != null ? DateTime.Now.Year - emp.Birthdate.Value.Year + " Years Old" : "",
                        WorkStatus = emp.Placements.Count != 0 ? emp.Placements.ToList()[emp.Placements.Count - 1].PlacementStatus : "Idle",
                        endDate = emp.Placements.Count != 0 ? emp.Placements.ToList()[emp.Placements.Count - 1].EndDate : null,
                        NoticePeriode = null,
                        FinancialIndustry = emp.FinancialIndustry,
                        CvBerca = "cvberca",


                    }).ToList();

            var nonras = _context.NonRasCandidates
            .Where(f => f.isDeleted != true)
            .Select(non => new SharedShortListVM
            {
                NonRAS_Id = non.NonRasId != null ? non.NonRasId : 0,
                Fullname = non.Fullname != null ? non.Fullname : "",
                Position = non.Position != null ? non.Position : "",
                Skillset = non.Skillset != null ? non.Skillset : "",
                Level = non.Level != null ? non.Level : "",
                Education = non.Education != null ? non.Education : "",
                Ipk = non.Ipk != null ? non.Ipk : "",
                University = non.University != null ? non.University : "",
                Age = non.Birthdate != "" || non.Birthdate != null ? non.Birthdate + " Years Old" : "",
                ExperienceInYear = non.ExperienceInYear != null ? non.ExperienceInYear : "",
                WorkStatus = non.WorkStatus != null ? non.WorkStatus : "",
                NoticePeriode = non.NoticePeriode != null ? non.NoticePeriode : "",
                FinancialIndustry = non.FinancialIndustry != null ? non.FinancialIndustry : "",
                CvBerca = non.CvBerca != null ? non.CvBerca : ""
            })
            .ToList();

            List<SharedShortListVM> sharedShortLists = new List<SharedShortListVM>();
            sharedShortLists.AddRange(employees);
            sharedShortLists.AddRange(nonras);

            return sharedShortLists;

        }*/

        public int Add(NonRasCandidate nonRasCandidate)
        {
            /*  nonRasCandidate.NonRasId = GenerateNonId()*/
            ;
            nonRasCandidate.IntwDateByRas = null;
            _context.Entry(nonRasCandidate).State = EntityState.Added;
            var save = _context.SaveChanges();
            return save;
        }

        public int Delete(int key)
        {
            var nonras = _context.NonRasCandidates.Find(key);

            nonras.isDeleted = true;
            _context.NonRasCandidates.Update(nonras);
            return _context.SaveChanges();

        }
    }
}
