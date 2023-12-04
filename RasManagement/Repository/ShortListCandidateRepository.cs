namespace RasManagement.Repository
{
    public class ShortListCandidateRepository : GeneralRepository<ProjectRasmanagementContext, ShortlistCandidate, int>
    {
        private readonly ProjectRasmanagementContext context;
        public ShortListCandidateRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }
    }
}
