using System;
using System.Collections.Generic;

namespace club.Models;

public partial class ClubTemplates
{
    public int Id { get; set; }

    //public int MeetingId { get; set; }

    public string Title { get; set; } = null!;

    public string Markdown { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
    public virtual ICollection<Meeting> Meetings { get; set; } = new List<Meeting>();
    public virtual Club Club { get; set; } = null!;
}
