using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class Account
{
    public string AccountId { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? Nickname { get; set; }

    public string Fullname { get; set; } = null!;

    public string Birthplace { get; set; } = null!;

    public DateTime Birthdate { get; set; }

    public string Religion { get; set; } = null!;

    public bool? Gender { get; set; }

    public bool? Maritalstatus { get; set; }

    public string? Hiredstatus { get; set; }

    public string? Nationality { get; set; }

    public string Phone { get; set; } = null!;

    public string Address { get; set; } = null!;

    public byte[]? Image { get; set; }

    public string RoleId { get; set; } = null!;

    public virtual Role Role { get; set; } = null!;
}
