using System;
using System.Collections.Generic;

namespace club.Models;

public partial class MeetingsSuggestion
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Club Club { get; set; } = null!;

    public virtual ICollection<MeetingsSuggestionsUpvote> MeetingsSuggestionsUpvotes { get; set; } = new List<MeetingsSuggestionsUpvote>();
    public virtual ICollection<MeetingsSuggestionsDownvote> MeetingsSuggestionsDownvotes { get; set; } = new List<MeetingsSuggestionsDownvote>();

    public virtual ApplicationUser User { get; set; } = null!;


}
