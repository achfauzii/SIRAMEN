namespace RasManagement.Repository
{
    public class TrackingRepository : GeneralRepository<ProjectRasmanagementContext, TrackingInterview, int>
    {
        private readonly ProjectRasmanagementContext _context;
        public TrackingRepository(ProjectRasmanagementContext _context) : base(_context)
        {
            this._context = _context;
        }
    }
}
