using club.Models;

namespace club.Dtos
{
    public class StockDTO
    {
        public int? Id { get; set; }

        public string StockId { get; set; } = null!;

        public string StockName { get; set; } = null!;

        public decimal BuyPrice { get; set; }

        public decimal? SellPrice { get; set; }

        public decimal? CurrentPrice { get; set; }

        public decimal Amount { get; set; }

        public bool Sold { get; set; }

        public DateTime InvestedAt { get; set; }

        public DateTime? SoldAt { get; set; }
    }
}
