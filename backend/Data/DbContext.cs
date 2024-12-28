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
        public DbSet<Models.ApplicationUser> User { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<MeetingsSuggestion>()
                .Property<DateTime>("CreatedAt")
                .HasDefaultValueSql("NOW()");
        }

    }
}
