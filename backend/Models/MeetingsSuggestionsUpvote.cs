using System;
using System.Collections.Generic;

namespace club.Models;

public partial class MeetingsSuggestionsUpvote
{
    public int Id { get; set; }

    public virtual MeetingsSuggestion MeetingsSuggestion { get; set; } = null!;

    public virtual ApplicationUser User { get; set; } = null!;
}
