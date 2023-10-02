using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class NonRasCandidate
{
    public string NonRasId { get; set; } = null!;

    public string? Fullname { get; set; }

    public string? Position { get; set; }

    public string? Skillset { get; set; }

    public string? Education { get; set; }

    public string? University { get; set; }

    public string? Domisili { get; set; }

    public DateTime? Birthdate { get; set; }

    public string? Level { get; set; }

    public int? ExperienceInYear { get; set; }

    public string? FilteringBy { get; set; }

    public string? WorkStatus { get; set; }

    public string? NoticePeriode { get; set; }

    public string? FinancialIndustry { get; set; }

    public string? RawCv { get; set; }

    public string? CvBerca { get; set; }

    public string? EnglishLevel { get; set; }

    public string? CurrentSalary { get; set; }

    public string? ExpectedSalary { get; set; }

    public string? Negotiable { get; set; }

    public string? IntwByRas { get; set; }

    public DateTime? IntwDateByRas { get; set; }

    public string? IntwUser { get; set; }

    public string? NameOfUser { get; set; }

    public string? IntwDateUser { get; set; }

    public string? LevelRekom { get; set; }

    public string? Status { get; set; }

    public string? Notes { get; set; }

    public DateTime? LastModified { get; set; }
}
