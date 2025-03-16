using club.Models;

namespace club.Dtos
{
    public class MeetingDecisionDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;
    
        public DateTime ExpiresAt { get; set; }

        public virtual UserDTO User { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
        public bool Completed { get; set; }
        public virtual ICollection<MeetingDecisionUpvoteDto> MeetingsDecisionsUpvotes { get; set; } = new List<MeetingDecisionUpvoteDto>();
        public virtual ICollection<MeetingDecisionDownvoteDto> MeetingsDecisionsDownvotes { get; set; } = new List<MeetingDecisionDownvoteDto>();

    }
}
