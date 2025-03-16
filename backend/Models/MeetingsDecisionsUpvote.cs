
namespace club.Models;

public partial class MeetingsDecisionsUpvote
{
    public int Id { get; set; }

    public virtual MeetingsDecisions MeetingsDecisions { get; set; } = null!;

    public virtual ApplicationUser User { get; set; } = null!;
}
