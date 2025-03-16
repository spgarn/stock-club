using System;
using System.Collections.Generic;
using club.Services;

namespace club.Models;

public partial class Club
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
    
    [SqlDefaultValue(DefaultValue = "false")]
    public bool PublicInvestments { get; set; }
    
    [SqlDefaultValue(DefaultValue = "0")]
    public decimal Cash { get; set; }

    public virtual ICollection<Meeting> Meetings { get; set; } = new List<Meeting>();

    public virtual ICollection<MeetingsSuggestion> MeetingsSuggestions { get; set; } = new List<MeetingsSuggestion>();

    public virtual ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
}
