using Microsoft.EntityFrameworkCore;
using RasManagement.Interface;
using RasManagement.ViewModel;
using System.Linq;
using System.Threading.Tasks;

namespace RasManagement.Repository
{
    public class UniversitasRepository : GeneralRepository<ProjectRasmanagementContext, DataUniversita, int>
    {
        private readonly ProjectRasmanagementContext context;

        public UniversitasRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }
    }
}
