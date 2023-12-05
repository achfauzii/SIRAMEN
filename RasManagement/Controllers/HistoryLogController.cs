using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;

namespace RasManagement.Controllers
{
    public class HistoryLogController : BaseController<HistoryLog, HistoryLogRepository, int>
    {
        private readonly HistoryLogRepository historyLogRepository;
        public HistoryLogController(HistoryLogRepository historyLogRepository) : base(historyLogRepository)
        {
            this.historyLogRepository = historyLogRepository;
        }
    }
}
