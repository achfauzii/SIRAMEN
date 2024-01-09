namespace RasManagement.ViewModel
{
    public class PlacementVM
    {
        public int PlacementStatusId { get; set; }

        public string CompanyName { get; set; } = null!;
        public string JobRole { get; set; } = null!;
        public string PicName { get; set; } = null!;
        public DateTime? StartDate { get; set; } 
        public DateTime? EndDate { get; set; }

        public string Description { get; set; } = null!;

        public string PlacementStatus { get; set; } = null!;
        public string AccountId { get; set; } = null!;
    }
}
