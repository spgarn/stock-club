using club.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace club.Data
{
    public class MyDbContext(DbContextOptions<MyDbContext> options) : IdentityDbContext<ApplicationUser>(options)
    {
        // Define DbSets for your entities, for example:
        public DbSet<Models.Club> Club { get; set; }
        public DbSet<Models.Meeting> Meeting { get; set; }
        public DbSet<Models.MeetingChat> MeetingChat { get; set; }
        public DbSet<Models.ClubTemplates> ClubTemplates { get; set; }
        public DbSet<Models.Decisions> Decisions { get; set; }
        public DbSet<Models.MeetingsSuggestion> MeetingsSuggestion { get; set; }
        public DbSet<Models.MeetingsSuggestionsUpvote> MeetingsSuggestionsUpvote { get; set; }
        public DbSet<Models.MeetingsSuggestionsDownvote> MeetingsSuggestionsDownvote { get; set; }
        public DbSet<Models.StockHolding> StockHolding { get; set; }
        public DbSet<Models.Stock> Stock { get; set; }
        public DbSet<Models.ApplicationUser> User { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<MeetingsSuggestion>()
                .Property<DateTime>("CreatedAt")
                .HasDefaultValueSql("NOW()");
            // Configure the many-to-many for meeting attendance
            modelBuilder.Entity<Meeting>()
                .HasMany(m => m.Attendees)
                .WithMany(u => u.AttendedMeetings)
                .UsingEntity(j => j.ToTable("MeetingAttendees"));

            // Configure the many-to-many for meeting declines
            modelBuilder.Entity<Meeting>()
                .HasMany(m => m.Decliners)
                .WithMany(u => u.DeclinedMeetings)
                .UsingEntity(j => j.ToTable("MeetingDecliners"));
        }
    }
}