namespace RasManagement.ViewModel
{
    public class TimeSheetReportVM
    {
        public int Id { get; set; }

        public string? Activity { get; set; }

        public DateTime? Date { get; set; }

        public string? Flag { get; set; }

        public string? Category { get; set; }

        public string? Status { get; set; }

        public string? KnownBy { get; set; }

        public int? PlacementStatusId { get; set; }



        public string CompanyName { get; set; } = null!;

        public string? JobRole { get; set; }

        public string? Description { get; set; }

        public string? PlacementStatus { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string? PicName { get; set; }

        public string AccountId { get; set; } = null!;
    }
}
