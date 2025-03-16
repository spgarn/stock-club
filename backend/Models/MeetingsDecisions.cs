using club.Services;

namespace club.Models;

public partial class MeetingsDecisions
{
    public int Id { get; set; }
    
    public virtual Meeting Meeting { get; set; } = null!;

    public string Title { get; set; } = null!;
    
    public DateTime ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Club Club { get; set; } = null!;
    
    [SqlDefaultValue(DefaultValue = "false")]
    public bool Completed { get; set; }

    public virtual ApplicationUser User { get; set; } = null!;
    
    public virtual ICollection<MeetingsDecisionsUpvote> MeetingsDecisionsUpvotes { get; set; } = new List<MeetingsDecisionsUpvote>();
    public virtual ICollection<MeetingsDecisionsDownvote> MeetingsDecisionsDownvotes { get; set; } = new List<MeetingsDecisionsDownvote>();

}
