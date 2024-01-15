using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RasManagement.Models;

public partial class Position
{
    public int Id { get; set; }

    public string? PositionClient { get; set; }

    public string? Level { get; set; }

    public string? Quantity { get; set; }

    public string? Status { get; set; }

    public string? Notes { get; set; }

    public int? ClientId { get; set; }
    [JsonIgnore]
    public virtual ClientName? Client { get; set; }
    [JsonIgnore]
    public virtual ICollection<TrackingInterview>? TrackingInterviews { get; set; } = new List<TrackingInterview>();
}
