using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RasManagement.Models;

public partial class ShortlistCandidate
{
    public int ShortlistId { get; set; }

    public string? AccountId { get; set; }

    public string? Position { get; set; }

    public string? Domisili { get; set; }

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

    public string? LevelRekom { get; set; }

    public string? Notes { get; set; }
    [JsonIgnore]
    public virtual Account? Account { get; set; }

    public virtual ICollection<OfferCandidate> OfferCandidates { get; set; } = new List<OfferCandidate>();
}
