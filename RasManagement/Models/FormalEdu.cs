﻿using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RasManagement.Models;

public partial class FormalEdu
{
    public int FormalEduId { get; set; }

    public string UniversityName { get; set; } = null!;

    public string Location { get; set; } = null!;

    public string Major { get; set; } = null!;

    public string Degree { get; set; } = null!;

    public string? Ipk { get; set; }

    public string Years { get; set; } = null!;

    public string? AccountId { get; set; } = null!;

    [JsonIgnore]
    public virtual Account? Account { get; set; } = null!;
}
