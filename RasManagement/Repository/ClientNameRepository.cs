using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Utilities;
using RasManagement.Controllers;
using RasManagement.ViewModel;

namespace RasManagement.Repository
{
    public class ClientNameRepository : GeneralRepository<ProjectRasmanagementContext, ClientName, int>
    {
        private readonly ProjectRasmanagementContext context;

        public ClientNameRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }
        public async Task<bool> ClientNameIsExist(string nameClient, string salesName)
        {
            
            var clientnameExists = await context.ClientNames.AnyAsync(a => a.NameOfClient == nameClient && a.SalesName == salesName);

            return clientnameExists;
        }
        public async Task<int> AddClient(ClientNameInputModel inputModel)
        {
            var client = new ClientName
            {
                NameOfClient = inputModel.NameOfClient,
                SalesName = inputModel.SalesName,
                SalesContact = inputModel.SalesContact,
                ClientContact = inputModel.ClientContact,
                PicClient = inputModel.PicClient,
                CompanyOrigin = inputModel.CompanyOrigin,
                Authority = inputModel.Authority,
                Industry = inputModel.Industry,
            };
            context.ClientNames.Add(client);
            var insert = context.SaveChanges();
            return insert;
        }

        public async Task<ClientName> ChangeName(string clientname, int id)
        {
            
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

        public async Task<object> GetClientRequirement()
        {
            //Get Data by Status Position is Open
            var data = context.Positions.Include(c => c.Client)
                            .Where(p => p.Status == "Open")
                            .ToList() // Fetch the data from the database
                            .GroupBy(p => new { clientName = p.Client.NameOfClient })
                            .Select(group => new
                            {
                                nameOfClient = group.Key.clientName,
                                status = "Open",
                                quantity = group.Sum(p =>
                                {
                                    int parsedQuantity;
                                    return int.TryParse(p.Quantity, out parsedQuantity) ? parsedQuantity : 0;
                                }),
                            })
                            .OrderByDescending(item => item.quantity)
                            .ToList();

            //Get Data by Status Position is not Open
            var otherData = context.Positions.Include(c => c.Client)
                            .Where(p => p.Status != "Open")
                            .ToList() // Fetch the data from the database
                            .GroupBy(p => new { clientName = p.Client.NameOfClient })
                            .Select(group => new
                            {
                                nameOfClient = group.Key.clientName,
                                status = "Not Open",
                                quantity = group.Sum(p =>
                                {
                                    int parsedQuantity;
                                    return int.TryParse(p.Quantity, out parsedQuantity) ? parsedQuantity : 0;
                                }),
                            })
                            .OrderByDescending(item => item.quantity)
                            .ToList();

            data.AddRange(otherData);

            // Combine the two lists
            var combinedData = data.Concat(otherData)
                        .GroupBy(item => item.nameOfClient)
                        .Select(group =>
                        {
                            var openEntry = group.FirstOrDefault(item => item.status == "Open");
                            if (openEntry != null)
                            {
                                // If there is an 'Open' entry for this client, return it
                                return openEntry;
                            }
                            else
                            {
                                // If there is no 'Open' entry, return the first 'Not Open' entry
                                return group.First();
                            }
                        })
                        .OrderByDescending(item => item.status).ThenByDescending(item => item.quantity)
                        .ToList();

            return combinedData;
        }

    }
}
