namespace club.Dtos
{
    public class AddMeeting
    {
        public string Name { get; set; } = null!;

        public string Description { get; set; } = null!;

        public DateTime MeetingTime { get; set; }

        public string Location { get; set; } = null!;

        public string Agenda { get; set; } = null!;
        public string MeetingProtocol { get; set; } = null!;
    }
}
