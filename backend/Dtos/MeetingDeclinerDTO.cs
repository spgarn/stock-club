public class MeetingDeclinerDTO
{
    public string UserId { get; set; } = null!;
    public string Id { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public bool Admin { get; set; }

    public string? VotingPowerGivenTo { get; set; }
}