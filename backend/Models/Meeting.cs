using System;
using System.Collections.Generic;

namespace club.Models;

public partial class Meeting
{
    public int Id { get; set; }

    //public int ClubId { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;
    public string Location { get; set; } = null!;

    public string Agenda { get; set; } = null!;
    public string MeetingProtocol { get; set; } = null!;

    public DateTime MeetingTime { get; set; }

    public DateTime? EndedAt { get; set; }

    public virtual ICollection<MeetingsSuggestion> MeetingSuggestions { get; set; } = new List<MeetingsSuggestion>();
    
    public virtual ICollection<MeetingsDecisions> MeetingsDecisions { get; set; } = new List<MeetingsDecisions>();

    public virtual ICollection<ApplicationUser> Attendees { get; set; } = new List<ApplicationUser>();

    public virtual ICollection<MeetingDecliner> Decliners { get; set; } = new List<MeetingDecliner>();

    public virtual Club Club { get; set; } = null!;
    //public virtual ClubTemplates? MeetingProtocolTemplate { get; set; } = null;

    public virtual ICollection<MeetingChat> MeetingChats { get; set; } = new List<MeetingChat>();
}