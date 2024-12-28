using club.Models;

namespace club.Dtos
{
    public class MeetingChatDTO
    {
        public int Id { get; set; }

        public string Message { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public virtual UserDTO User { get; set; } = null!;
    }
}
