﻿namespace RasManagement.Repository
{
    public class ClientNameRepository : GeneralRepository<ProjectRasmanagementContext, ClientName, int>
    {
        private readonly ProjectRasmanagementContext context;

        public ClientNameRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }
        public async Task<bool> ClientNameIsExist(string name, int? id = null)
        {
            // Use AnyAsync to check if any department with the given name exists
            var clientnameExists = await context.ClientNames.AnyAsync(a => a.NameOfClient == name && (id == null || a.Id != id));

            return clientnameExists;
        }
        public async Task<ClientName> AddClient(string clientname)
        {
            // Assuming you have a Department model and DbSet<Department> in your context
            var newClient = new ClientName { NameOfClient = clientname };

            // Add the new department to the context and save changes
            context.ClientNames.Add(newClient);
            await context.SaveChangesAsync();

            return newClient;
        }

        public async Task<ClientName> ChangeName(string clientname, int id)
        {
            // Assuming you have a Department model and DbSet<Department> in your context
            var newClient = new ClientName
            {
                NameOfClient = clientname,
                Id = id
            };

            // Add the new department to the context and save changes
            context.ClientNames.Update(newClient);
            await context.SaveChangesAsync();

            return newClient;
        }

    }
}
