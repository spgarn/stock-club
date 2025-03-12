namespace club.Dtos;

public class MeetingDeclinerDTO
{
    public string UserId { get; set; } = null!;
    public UserDTO User { get; set; } = null!;
    
    public string? VotingPowerGivenTo { get; set; }
}