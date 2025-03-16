using club.Models;

namespace club.Dtos
{
    public class AddNews
    {
        public string Title { get; set; } = null!;

        public string Markdown { get; set; } = null!;
    }
}
