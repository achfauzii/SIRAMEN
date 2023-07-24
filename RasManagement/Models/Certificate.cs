using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RasManagement.Models;

public partial class Certificate
{
    public int CertificateId { get; set; }

    public string Name { get; set; } = null!;

    public string Publisher { get; set; } = null!;

    public string PublicationYear { get; set; } = null!;

    public string ValidUntil { get; set; } = null!;

    public string AccountId { get; set; } = null!;

    [JsonIgnore]
    public virtual Account? Account { get; set; } = null!;
}
