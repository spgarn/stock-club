using club.Models;

namespace club.Dtos
{
    public class EditClubForm
    {
        public string Name { get; set; }

        public decimal Cash { get; set; }

        public bool PublicInvestments { get; set; }
    }
}