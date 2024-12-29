using club.Models;

namespace club.Dtos
{
    public class StockSplitForm
    {
        public int Id { get; set; }

        public decimal SellPrice { get; set; }

        public decimal Amount { get; set; }

        public DateTime SoldAt { get; set; }
    }
}
