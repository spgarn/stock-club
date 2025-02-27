using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace club.Models
{
    public class ApplicationUser : IdentityUser
    {
        // Add custom properties here
        [MaxLength(50)]
        [PersonalData]
        public string FirstName { get; set; }

        [MaxLength(50)]
        [PersonalData]
        public string LastName { get; set; }

        //[MaxLength(200)]
        //public string Address { get; set; }

        //public DateTime DateOfBirth { get; set; }

        // Custom logic or computed properties can also be added
        public string FullName => $"{FirstName} {LastName}";
        
        // Existing: If you have one for attended meetings (optional)
        public virtual ICollection<Meeting> AttendedMeetings { get; set; } = new List<Meeting>();

        // New: For declined meetings
        public virtual ICollection<Meeting> DeclinedMeetings { get; set; } = new List<Meeting>();

        public virtual ICollection<MeetingChat> MeetingChats { get; set; } = new List<MeetingChat>();

        public virtual ICollection<MeetingsSuggestion> MeetingsSuggestions { get; set; } = new List<MeetingsSuggestion>();

        public virtual ICollection<MeetingsSuggestionsUpvote> MeetingsSuggestionsUpvotes { get; set; } = new List<MeetingsSuggestionsUpvote>();

        public virtual ICollection<StockHolding> StockHoldings { get; set; } = new List<StockHolding>();
        public virtual ICollection<Club> Clubs { get; set; } = new List<Club>();
    }
}
