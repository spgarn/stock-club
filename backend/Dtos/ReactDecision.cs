namespace club.Dtos
{
    public class ReactDecision
    {
        public int ClubId { get; set; }
        public int MeetingId { get; set; }
        public int DecisionId { get; set; }
        public bool IsUpvote { get; set; }
    }
}
