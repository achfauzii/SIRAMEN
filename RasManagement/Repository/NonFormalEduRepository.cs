
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