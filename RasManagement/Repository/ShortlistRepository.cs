using Microsoft.EntityFrameworkCore;
using RasManagement.Interface;
using RasManagement.ViewModel;

namespace RasManagement.Repository
{
    public class ShortlistRepository : GeneralRepository<ProjectRasmanagementContext, NonRasCandidate, int>
    {
        private readonly ProjectRasmanagementContext context;

        public ShortlistRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }
    }
}
