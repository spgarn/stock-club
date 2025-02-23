using System;
using System.Collections.Generic;
using club.Services;

namespace club.Models;

public partial class MeetingsSuggestion
{
    public int Id { get; set; }
    
    public virtual Meeting Meeting { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Club Club { get; set; } = null!;
    
    [SqlDefaultValue(DefaultValue = "false")]
    public bool Completed { get; set; }

    public virtual ICollection<MeetingsSuggestionsUpvote> MeetingsSuggestionsUpvotes { get; set; } = new List<MeetingsSuggestionsUpvote>();
    public virtual ICollection<MeetingsSuggestionsDownvote> MeetingsSuggestionsDownvotes { get; set; } = new List<MeetingsSuggestionsDownvote>();

    public virtual ApplicationUser User { get; set; } = null!;
    
    


}
