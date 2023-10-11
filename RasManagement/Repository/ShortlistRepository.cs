using Microsoft.EntityFrameworkCore;
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
                return ras + "00";
            }
            return $"{ras}{countNonRas.ToString("D3")}";
        }

        public int Add(NonRasCandidate nonRasCandidate)
        {
            nonRasCandidate.NonRasId = GenerateNonId();
            nonRasCandidate.IntwDateByRas = null;
            _context.Entry(nonRasCandidate).State = EntityState.Added;
            var save = _context.SaveChanges();
            return save;
        }

    }
}
