using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class RasprojectAccount
{
    public string AccountId { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;
}
