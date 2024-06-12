namespace RasManagement.ViewModel
{
    public class EmployeePlacementVM
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
        public virtual ClientName? Client { get; set; }
        public virtual Position? Position { get; set; }
    }

    public class StatusEmpVM
    {
        public string AccountId { get; set; } = null!;

        public string PlacementStatus { get; set; } = null!;

        public DateTime? JoinDate { get; set; }

    }
}
