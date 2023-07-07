using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class Placement
{
    public int PlacementStatusId { get; set; }

    public string CompanyName { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string PlacementStatus { get; set; } = null!;

    public string AccountId { get; set; } = null!;

    public virtual Account Account { get; set; } = null!;
}
