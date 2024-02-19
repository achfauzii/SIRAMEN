namespace RasManagement.ViewModel
{
    public class TurnOverVM
    {
        public string AccountId { get; set; } = null!;
        public int PlacementStatusId { get; set; }
        public string? PlacementStatus { get; set; }
        public int? ClientId { get; set; }
        public DateTime? EndDate { get; set; }
        public string Description { get; set; } = null!;

    }
}
