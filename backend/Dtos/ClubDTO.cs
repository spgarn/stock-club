using club.Models;

namespace club.Dtos
{
    public class ClubDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<MeetingDTO> Meetings { get; set; } = new List<MeetingDTO>();

        public ICollection<MeetingSuggestionDTO> MeetingsSuggestions { get; set; } = new List<MeetingSuggestionDTO>();

        public ICollection<UserDTO> Users { get; set; } = new List<UserDTO>();
    }
}
