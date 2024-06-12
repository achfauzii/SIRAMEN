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

    public string? LastUpdate { get; set; }


    public string? ProjectType { get; set; }
    public string? StartedYear { get; set; }
    public int? SalesProject { get; set; }
    public int? COGS { get; set; }
    public int? GPM { get; set; }

    public int? SoNumber { get; set; }

    public int? ClientId { get; set; }

    //[JsonIgnore]
    public virtual ClientName? Client { get; set; }

    [JsonIgnore]
    public virtual ICollection<ActivitySalesProjection>? ActivitySalesProjections { get; set; } = new List<ActivitySalesProjection>();

    [JsonIgnore]
    public virtual ICollection<Position>? Positions { get; set; } = new List<Position>();

}


