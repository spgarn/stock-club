using System;
using System.Collections.Generic;

namespace club.Models;

public partial class Club
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Meeting> Meetings { get; set; } = new List<Meeting>();

    public virtual ICollection<MeetingsSuggestion> MeetingsSuggestions { get; set; } = new List<MeetingsSuggestion>();

    public virtual ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
}
