namespace RasManagement.Repository
{
    public class TrackingRepository : GeneralRepository<ProjectRasmanagementContext, TrackingInterview, int>
    {
        private readonly ProjectRasmanagementContext _context;
        public TrackingRepository(ProjectRasmanagementContext _context) : base(_context)
        {
            this._context = _context;
        }
        public IEnumerable<object> GetTrackingInterview()
        {
            var data = _context.TrackingInterviews
                .Include(ti => ti.NonRas)
                .Include(t3 => t3.Client)
                .Include(t4 => t4.Position)
                .Include(t2 => t2.Account)
                .Select(ti => new
                {
                    id = ti.Id,
                    accountId = ti.AccountId,
                    nonRasId = ti.NonRasId,
                    fullnameNonRAS = ti.NonRas.Fullname,
                    fullnameEmployee = ti.Account.Fullname,
                    client = ti.Client.NameOfClient,
                    position = ti.PositionName,
                    intDate = ti.IntvwDate,
                    intStatus = ti.IntvwStatus,
                    notes = ti.Notes
                }
                )
                .ToList();
            // var data = _context.TrackingInterviews
            // .Join(
            //     _context.Accounts,
            //     ti => ti.AccountId,
            //     acc => acc.AccountId,
            //     (ti, acc) => new { ti, acc }
            // )
            // .Join(
            //     _context.NonRasCandidates,
            //     tr => tr.ti.NonRasId,
            //     nonras => nonras.NonRasId,
            //     (tr, nonras) => new { tr, nonras }
            // )
            // .Join(
            //     _context.ClientNames,
            //     tracking => tracking.tr.ti.ClientId,
            //     client => client.Id,
            //     (tracking, client) => new
            //     {
            //         id = tracking.tr.ti.Id,
            //         fullnameNonRAS = tracking.nonras.Fullname,
            //         fullnameEmployee = tracking.tr.acc.Fullname,
            //         client = client.NameOfClient,
            //         intDate = tracking.tr.ti.IntvwDate,
            //         intStatus = tracking.tr.ti.IntvwStatus
            //     }
            // ).ToList();

            return data;
        }
    }
}
