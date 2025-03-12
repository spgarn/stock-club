using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace club.Models
{
    public class MeetingDecliner
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MeetingId { get; set; }
        public Meeting Meeting { get; set; } = null!;

        [Required]
        public string UserId { get; set; }
        public ApplicationUser User { get; set; } = null!;

        // NEW: Optional Voting Delegation
        public string? VotingPowerGivenTo { get; set; } 

        [ForeignKey("VotingPowerGivenTo")]
        public ApplicationUser? VotingPowerReceiver { get; set; }
    }
}