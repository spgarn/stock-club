using club.Models;

namespace club.Dtos
{
    public class AddClubForm
    {
        public string Name { get; set; }

        public decimal Cash { get; set; }

        public bool PublicInvestments { get; set; }
    }
}