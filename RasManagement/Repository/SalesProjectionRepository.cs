namespace RasManagement.Repository
{
    public class SalesProjectionRepository : GeneralRepository<ProjectRasmanagementContext, SalesProjection, int>
    {
        private readonly ProjectRasmanagementContext context;

        public SalesProjectionRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<List<SalesProjection>> GetByProjectionStatus(string status)
        {
            var data = await context.SalesProjections
                .Where(e => e.ProjectStatus.ToLower() == status)
                .Include(e => e.Client)
                .ToListAsync();

            return data;
        }

        public async Task<List<SalesProjection>> GetByClientId(int clientId)
        {
            var data = await context.SalesProjections
                .Where(e => e.ClientId == clientId)
                .Include(e => e.Client)
                .ToListAsync();

            return data;
        }


        public async Task<List<SalesProjection>> getFullData()
        {
            var data = await context.SalesProjections
                .Include(e => e.Client)
                .ToListAsync();
            return data;
        }

        public async Task<List<SalesProjection>> salesProjectionForTrackingInterview()
        {
            var data = await context.SalesProjections
                .Where(e => e.ProjectStatus.ToLower() == "open" || e.ProjectStatus.ToLower() == "re open")
                .Include(e => e.Client)
                .ToListAsync();

            return data;
        }

        public async Task<Object> ChartSalesPositions(int year)
        {
            var spIds = await context.SalesProjections
        .Where(sp => sp.EntryDate.Value.Year == year)
        .Select(sp => sp.Id)
        .ToListAsync();


            var positions = await context.Positions
                .Where(p => spIds.Contains((int)p.SP_Id))
                .ToListAsync();


            var groupedPositions = positions
                .GroupBy(p => p.PositionClient)
                .Select(g => new { PositionType = g.Key, Count = g.Count() })
                .ToList();

            return groupedPositions;
        }

        public async Task<IEnumerable<dynamic>> GetSalesProjectionGroupByLastUpdate(string status)
        {
            var data = await context.SalesProjections
          .Where(sp => sp.ProjectStatus == status)
         .GroupBy(sp => sp.LastUpdate)
         .Select(g => new
         {
             LastUpdate = g.Key,
             Total = g.Count()
         })
         .ToListAsync();

            return data ;


        }
    }

    public class chartSalesPosition
    {
        public string position { get; set; }
        public int count { get; set; }
        public int year { get; set; }
        public int id { get; set; }

        public int totalPosition { get; set; }
    }
}