namespace RasManagement.ViewModel
{
    public class PlacementVM
    {
        public int PlacementStatusId { get; set; }

        public int? ClientId { get; set; }
        public int? PositionId { get; set; }
        public string? PicName { get; set; }
        public string? PicRas { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public string Description { get; set; } = null!;

        public string PlacementStatus { get; set; } = null!;
        public string AccountId { get; set; } = null!;
    }
}
