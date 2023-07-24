using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RasManagement.Models;

public partial class Qualification
{
    public int QualificationId { get; set; }

    public string Framework { get; set; } = null!;

    public string ProgrammingLanguage { get; set; } = null!;

    public string Database { get; set; } = null!;

    public string Tools { get; set; } = null!;

    public string Others { get; set; } = null!;

    public string? AccountId { get; set; }

    [JsonIgnore]
    public virtual Account? Account { get; set; }
}
