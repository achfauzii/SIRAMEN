using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class Certificate
{
    public int CertificateId { get; set; }

    public string Name { get; set; } = null!;

    public string Publisher { get; set; } = null!;

    public string PublicationYear { get; set; } = null!;

    public string ValidUntil { get; set; } = null!;

    public string AccountId { get; set; } = null!;

    public virtual Account Account { get; set; } = null!;
}
