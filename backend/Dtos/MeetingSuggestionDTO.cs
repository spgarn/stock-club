using club.Models;

namespace club.Dtos
{
    public class MeetingSuggestionDTO
    {
        public int Id { get; set; }

        public virtual MeetingDTO Meeting { get; set; } = null!;

        public string Title { get; set; } = null!;

        public string Description { get; set; } = null!;

        public virtual UserDTO User { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
        public bool Completed { get; set; }
        public virtual ICollection<MeetingSuggestionUpvoteDTO> MeetingsSuggestionsUpvotes { get; set; } = new List<MeetingSuggestionUpvoteDTO>();
        public virtual ICollection<MeetingSuggestionDownvoteDTO> MeetingsSuggestionsDownvotes { get; set; } = new List<MeetingSuggestionDownvoteDTO>();

    }
}
