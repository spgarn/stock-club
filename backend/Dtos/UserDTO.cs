namespace club.Dtos
{
    public class UserDTO
    {
        public string Id { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string? LastName { get; set; } = null;
        public string? UserName { get; set; } = null;
        public string? Email { get; set; } = null;
        public bool Admin { get; set; }

        // ✅ NEW: Add VotingPower
        public int VotingPower { get; set; } = 0;

        public virtual ICollection<ClubDto> Clubs { get; set; } = new List<ClubDto>();
    }
}