using Microsoft.EntityFrameworkCore;
using RasManagement.Interface;
using RasManagement.ViewModel;

namespace RasManagement.Repository
{
    public class QualificationRepository : GeneralRepository<ProjectRasmanagementContext, Qualification, int>
    {
        private readonly ProjectRasmanagementContext context;

        public QualificationRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }
        public async Task<List<Qualification>> GetQualificationByAccountId(string accountId)
        {
            var qualificationAccount= await context.Qualifications
                .Where(e => e.AccountId == accountId)
                .ToListAsync();

            return qualificationAccount;
        }

    }
}