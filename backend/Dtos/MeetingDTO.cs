using club.Models;

namespace club.Dtos
{
    public class MeetingDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public string Description { get; set; } = null!;

        public DateTime MeetingTime { get; set; }
        public DateTime? EndedAt { get; set; }

        public string Location { get; set; } = null!;

        public string Agenda { get; set; } = null!;
        public string MeetingProtocol { get; set; } = null!;
        
        public ICollection<UserDTO> Attendees { get; set; } = new List<UserDTO>();
        
        public ICollection<UserDTO> Decliners { get; set; } = new List<UserDTO>();

        public virtual ICollection<MeetingChatDTO> MeetingChats { get; set; } = new List<MeetingChatDTO>();
    }
}
