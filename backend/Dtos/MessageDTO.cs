using club.Models;

namespace club.Dtos
{
    public class MessageDTO
    {
        public int Id { get; set; }
        public required string Message { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime InvestedAt { get; set; }

        public required UserDTO User { get; set; }
    }
}
