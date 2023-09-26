using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class OfferCandidate
{
    public int OfferCandidateId { get; set; }

    public string? IntwUser { get; set; }

    public string? NameOfUser { get; set; }

    public DateTime? IntwDateUser { get; set; }

    public int? ShortlistId { get; set; }

    public virtual ShortlistCandidate? Shortlist { get; set; }
}
