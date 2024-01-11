using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class ClientName
{
    public int Id { get; set; }

    public string? NameOfClient { get; set; }

    public virtual ICollection<Position> Positions { get; set; } = new List<Position>();

    public virtual ICollection<TrackingInterview> TrackingInterviews { get; set; } = new List<TrackingInterview>();

    public virtual ICollection<NonRasCandidate> NonRasCandidates { get; set; } = new List<NonRasCandidate>();
}
