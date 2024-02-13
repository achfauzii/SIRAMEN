using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RasManagement.Models;

public partial class ClientName
{
    public int Id { get; set; }

    public string? NameOfClient { get; set; }
    public string? SalesName { get; set; }
    public string? SalesContact { get; set; }
    public string? ClientContact { get; set; }
    [JsonIgnore]
    public virtual ICollection<Position>? Positions { get; set; } = new List<Position>();
    [JsonIgnore]
    public virtual ICollection<TrackingInterview>? TrackingInterviews { get; set; } = new List<TrackingInterview>();
    /*    [JsonIgnore]
        public virtual ICollection<NonRasCandidate>? NonRasCandidates { get; set; } = new List<NonRasCandidate>();*/
}
