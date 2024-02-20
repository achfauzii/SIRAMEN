namespace RasManagement.ViewModel
{
    public class PlacementVM
    {
        public int PlacementStatusId { get; set; }

        public int? Client_Id { get; set; }
        public int? Position_Id { get; set; }
        public string? PicName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public string Description { get; set; } = null!;

        public string PlacementStatus { get; set; } = null!;
        public string AccountId { get; set; } = null!;
    }
}
