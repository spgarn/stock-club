using club.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace club.Data
{
    public class MyDbContext(DbContextOptions<MyDbContext> options) : IdentityDbContext<ApplicationUser>(options)
    {
        public DbSet<Club> Club { get; set; }
        public DbSet<Meeting> Meeting { get; set; }
        public DbSet<MeetingChat> MeetingChat { get; set; }
        public DbSet<ClubTemplates> ClubTemplates { get; set; }
        public DbSet<Decisions> Decisions { get; set; }
        public DbSet<MeetingsSuggestion> MeetingsSuggestion { get; set; }
        public DbSet<MeetingsSuggestionsUpvote> MeetingsSuggestionsUpvote { get; set; }
        public DbSet<MeetingsSuggestionsDownvote> MeetingsSuggestionsDownvote { get; set; }
        public DbSet<StockHolding> StockHolding { get; set; }
        public DbSet<Stock> Stock { get; set; }
        public DbSet<ApplicationUser> User { get; set; }
        public DbSet<Currency> Currency { get; set; }

        // NEW: Add MeetingDecliner DbSet
        public DbSet<MeetingDecliner> MeetingDecliners { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Timestamp default
            modelBuilder.Entity<MeetingsSuggestion>()
                .Property<DateTime>("CreatedAt")
                .HasDefaultValueSql("NOW()");

            // Configure many-to-many for meeting attendance
            modelBuilder.Entity<Meeting>()
                .HasMany(m => m.Attendees)
                .WithMany(u => u.AttendedMeetings)
                .UsingEntity(j => j.ToTable("MeetingAttendees"));

            // NEW: Configure MeetingDecliners relationship explicitly
            modelBuilder.Entity<MeetingDecliner>()
                .HasOne(md => md.Meeting)
                .WithMany(m => m.Decliners)
                .HasForeignKey(md => md.MeetingId);

            modelBuilder.Entity<MeetingDecliner>()
                .HasOne(md => md.User)
                .WithMany(u => u.DeclinedMeetings)
                .HasForeignKey(md => md.UserId);

            modelBuilder.Entity<MeetingDecliner>()
                .HasOne(md => md.VotingPowerReceiver)
                .WithMany()
                .HasForeignKey(md => md.VotingPowerGivenTo)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}