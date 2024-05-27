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
        public async Task<List<ClientContainsOnsite>> GetClientStatusOnsite()
        {


            var uniqueClientIds = await context.Placements
                .Where(p => p.PlacementStatus == "Onsite")
                .Select(p => p.ClientId)
                .Distinct()
                .ToListAsync();


            var result =
                 await context.ClientNames
                  .Where(c => uniqueClientIds.Contains(c.Id))
               .Select(c => new ClientContainsOnsite
               {
                   Id = c.Id,
                   NameOfClient = c.NameOfClient,

               })
                 .ToListAsync();

            return result;
        }
        public async Task<object> GetClientRequirement()
        {
            // Fetch data and include related Client objects
            var positions = await context.Positions
                                .Include(c => c.Client)
                                .ToListAsync();

            if (positions == null)
            {
                throw new InvalidOperationException("Positions collection is null.");
            }

            // Process positions with status "Open"
            var openData = positions
                            .Where(p => p.Status == "Open" && p.Client != null && p.Client.NameOfClient != null)
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

            // Process positions with status not "Open"
            var otherData = positions
                            .Where(p => p.Status != "Open" && p.Client != null && p.Client.NameOfClient != null)
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

            // Combine and group the data
            var combinedData = openData.Concat(otherData)
                            .GroupBy(item => item.nameOfClient)
                            .Select(group =>
                            {
                                var openEntry = group.FirstOrDefault(item => item.status == "Open");
                                if (openEntry != null)
                                {
                                    return openEntry;
                                }
                                else
                                {
                                    return group.First();
                                }
                            })
                            .OrderByDescending(item => item.status)
                            .ThenByDescending(item => item.quantity)
                            .ToList();

            return combinedData;
        }

        public async Task<object> GetByMostClients()
        {
            // Fetch Tracking Interview Most Clients
            var clientsId = await context.TrackingInterviews
                        .Select(ti => ti.ClientId)
                        .ToListAsync();

            var clientFrequency = clientsId
                         .GroupBy(id => id)
                         .Select(group => new
                         {
                             ClientId = group.Key,
                             Count = group.Count()
                         })
                         .OrderByDescending(item => item.Count)
                         .ToList();

            var result = from cf in clientFrequency
                         join client in context.ClientNames
                         on cf.ClientId equals client.Id
                         select new
                         {
                             client.Id,
                             client.NameOfClient,
                             cf.Count
                         };

            return result.ToList();


        }
    }

        public class ClientContainsOnsite
    {

        public int Id { get; set; }
        public string NameOfClient { get; set; }
    }
}
