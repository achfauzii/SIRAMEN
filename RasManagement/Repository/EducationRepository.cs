using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Macs;
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

        public async Task<FormalEdu> GetByFormalEduId(int formalEduId)
        {
            return await context.FormalEdus.FindAsync(formalEduId);
        }


        public async Task<IEnumerable<FormalEdu>> Get()
        {
            return await context.FormalEdus.ToListAsync();
        }

        public async Task<int> InsertEducation(FormalEdu formalEdu)
        {
            context.FormalEdus.Add(formalEdu);
            var save = await context.SaveChangesAsync();

            return save;
            
        }

        public async Task<int> UpdateEducation(FormalEdu updateEdu)
        {
            context.Entry(updateEdu).State = EntityState.Modified;
            var save = await context.SaveChangesAsync();

            return save;
        }

        public async Task<bool> DeleteEducation(int educationId)
        {
            var education = await context.FormalEdus.FindAsync(educationId);
            if (education != null)
            {
                context.FormalEdus.Remove(education);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

    }
}