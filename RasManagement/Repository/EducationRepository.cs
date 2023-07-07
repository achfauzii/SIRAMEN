using Microsoft.EntityFrameworkCore;
using RasManagement.Interface;
using RasManagement.ViewModel;

namespace RasManagement.Repository
{
    public class EducationRepository : GeneralRepository<ProjectRasmanagementContext, FormalEdu, int>
    {
        private readonly ProjectRasmanagementContext context;

        public EducationRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }
        public async Task<List<FormalEdu>> GetEducationByAccountId(string accountId)
        {
            var educationAccount = await context.FormalEdus
                .Where(e => e.AccountId == accountId)
                .ToListAsync();

            return educationAccount;
        }

    }
}