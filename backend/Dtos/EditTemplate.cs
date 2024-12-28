using club.Models;

namespace club.Dtos
{
    public class EditTemplate
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;

        public string Markdown { get; set; } = null!;
    }
}
