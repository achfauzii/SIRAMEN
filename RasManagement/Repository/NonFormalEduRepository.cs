
using Microsoft.EntityFrameworkCore;
using RasManagement.Models;
using RasManagement.ViewModel;
using System.Reflection;

namespace RasManagement.Repository
{
    public class NonFormalEduRepository : GeneralRepository<ProjectRasmanagementContext, NonFormalEdu, int>
    {
        private readonly ProjectRasmanagementContext context;
        public NonFormalEduRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<List<NonFormalEdu>> GetEducationByAccountId(string accountId)
        {
            var educationAccount = await context.NonFormalEdus
                .Where(e => e.AccountId == accountId)
                .ToListAsync();

            return educationAccount;
        }

        public async Task<NonFormalEdu> GetByNonFormalEduId(int nonFormalEduId)
        {
            return await context.NonFormalEdus.FindAsync(nonFormalEduId);
        }

        public async Task<IEnumerable<NonFormalEdu>> Get()
        {
            return await context.NonFormalEdus.ToListAsync();
        }

        public async Task<int> InsertNonFormalEducation(NonFormalEdu nonFormalEdu)
        {
            context.NonFormalEdus.Add(nonFormalEdu);
            var save = await context.SaveChangesAsync();

            return save;

        }

        public async Task<int> UpdateNonFormalEducation(NonFormalEdu updateNonEdu)
        {
            context.Entry(updateNonEdu).State = EntityState.Modified;
            var save = await context.SaveChangesAsync();

            return save;
        }

        public async Task<bool> DeleteNonFormalEducation(int nonEducationId)
        {
            var education = await context.NonFormalEdus.FindAsync(nonEducationId);
            if (education != null)
            {
                context.NonFormalEdus.Remove(education);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        /*public int Insert(InsertNonFormalEdu insertNonFormalEdu)
        {
            NonFormalEdu nonFormalEdu = new NonFormalEdu
            {
                NonFormalId = insertNonFormalEdu.NonFormal_id,
                Name=insertNonFormalEdu.Name,
                Organizer = insertNonFormalEdu.Organizer,
                Years = insertNonFormalEdu.Years,
                Description = insertNonFormalEdu.Description,

            };
            context.Entry(nonFormalEdu).State = EntityState.Added;


            Account account = new Account
            {
                AccountId = insertNonFormalEdu.AccountId
            };

            context.Accounts.Add(account);
            return context.SaveChanges();
        }*/
    }

}