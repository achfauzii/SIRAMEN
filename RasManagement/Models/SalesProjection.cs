using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RasManagement.Models;

public partial class SalesProjection
{
    public int Id { get; set; }

    public DateTime? EntryDate { get; set; }

    public string? ProjectStatus { get; set; }

    public string? Attendees { get; set; }

    public string? RequestBy { get; set; }

    public string? HiringNeeds { get; set; }

    public string? Timeline { get; set; }
    public string? HiringProcess { get; set; }
    public string? WorkLocation { get; set; }

    public string? Notes { get; set; }
    public string? Priority { get; set; }

    public string? Status { get; set; }
    public string? ContractPeriode { get; set; }
    public string? RateCard { get; set; }
    public string? CurrentNews { get; set; }

    public int? ClientId { get; set; }

    //[JsonIgnore]
    public virtual ClientName? Client { get; set; }
    

}


