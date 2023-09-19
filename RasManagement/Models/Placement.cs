﻿using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RasManagement.Models;

public partial class Placement
{
    public int PlacementStatusId { get; set; }

    public string CompanyName { get; set; } = null!;

    public string? JobRole { get; set; }

    public string Description { get; set; } = null!;

    public string? PlacementStatus { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string AccountId { get; set; } = null!;
    [JsonIgnore]
    public virtual Account? Account { get; set; } = null!;
}
