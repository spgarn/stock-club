using System;
using System.Collections.Generic;

namespace club.Models;

public partial class MeetingsSuggestionsDownvote
{
    public int Id { get; set; }

    public virtual MeetingsSuggestion MeetingsSuggestion { get; set; } = null!;

    public virtual ApplicationUser User { get; set; } = null!;
}
