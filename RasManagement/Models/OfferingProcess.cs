using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class OfferingProcess
{
    public int Id { get; set; }

    public string? NameOfUser { get; set; }

    public string? InterviewUser { get; set; }

    public DateTime? InterviewDateUser { get; set; }

    public string? NonRasId { get; set; }

    public virtual NonRasCandidate? NonRas { get; set; }
}
