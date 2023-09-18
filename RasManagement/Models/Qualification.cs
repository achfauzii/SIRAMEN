using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RasManagement.Models;

public partial class Qualification
{
    public int QualificationId { get; set; }

    public string? Framework { get; set; }

    public string? ProgrammingLanguage { get; set; }

    public string? Database { get; set; }

    public string? Tools { get; set; }

    public string? Others { get; set; }

    public string AccountId { get; set; } = null!;
    [JsonIgnore]
    public virtual Account Account { get; set; } = null!;
}
