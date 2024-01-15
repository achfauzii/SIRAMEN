using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RasManagement.Models;

public partial class TrackingInterview
{
    public int Id { get; set; }

    public int? NonRasId { get; set; }

    public string? AccountId { get; set; }

    public int? ClientId { get; set; }

    public int? PositionId { get; set; }

    public string? IntvwDate { get; set; }

    public string? IntvwStatus { get; set; }

    public string? Notes { get; set; }
    [JsonIgnore]
    public virtual Account? Account { get; set; }
    [JsonIgnore]
    public virtual ClientName? Client { get; set; }
    [JsonIgnore]
    public virtual NonRasCandidate? NonRas { get; set; }
    [JsonIgnore]
    public virtual Position? Position { get; set; }
}
