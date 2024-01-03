using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class TimeSheet
{
    public int Id { get; set; }

    public string? Activity { get; set; }

    public DateTime? Date { get; set; }

    public string? Flag { get; set; }

    public string? Category { get; set; }

    public string? Status { get; set; }

    public string? KnownBy { get; set; }

    public int? PlacementStatusId { get; set; }

    public string? AccountId { get; set; }

    public virtual Account? Account { get; set; }

    public virtual Placement? PlacementStatus { get; set; }
}
