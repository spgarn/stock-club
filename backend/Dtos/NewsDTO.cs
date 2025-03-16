using club.Models;

namespace club.Dtos
{
    public class NewsDTO
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;

        public string Markdown { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
