using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class NonFormalEdu
{
    public int NonFormalId { get; set; }

    public string Name { get; set; } = null!;

    public string Organizer { get; set; } = null!;

    public string Years { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string AccountId { get; set; } = null!;

    public virtual Account Account { get; set; } = null!;
}
