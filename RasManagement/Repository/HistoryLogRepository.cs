namespace RasManagement.Repository
{
    public class HistoryLogRepository : GeneralRepository<ProjectRasmanagementContext, HistoryLog, int>
    {
        private readonly ProjectRasmanagementContext context;
        public HistoryLogRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }
    }
}
