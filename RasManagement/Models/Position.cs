using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class Position
{
    public int Id { get; set; }

    public string? Position1 { get; set; }

    public string? Level { get; set; }

    public string? Quantity { get; set; }

    public string? Status { get; set; }

    public string? Notes { get; set; }

    public int? ClientId { get; set; }

    public virtual ClientName? Client { get; set; }

    public virtual ICollection<TrackingInterview> TrackingInterviews { get; set; } = new List<TrackingInterview>();
}
