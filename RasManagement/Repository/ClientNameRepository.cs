namespace RasManagement.Repository
{
    public class ClientNameRepository : GeneralRepository<ProjectRasmanagementContext, ClientName, int>
    {
        private readonly ProjectRasmanagementContext context;

        public ClientNameRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }
        public async Task<bool> ClientNameIsExist(string clientname)
        {
            // Use AnyAsync to check if any department with the given name exists
            var clientnameExists = await context.ClientNames.AnyAsync(a => a.NameOfClient == clientname);

            return clientnameExists;
        }

    }
}
