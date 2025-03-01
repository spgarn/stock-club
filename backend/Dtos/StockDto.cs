using club.Models;

namespace club.Dtos
{
    public class StockDto
    {
        public int? Id { get; set; }

        public string StockName { get; set; } = null!;

        public string Currency { get; set; }

        public decimal BuyPrice { get; set; }

        public decimal? SellPrice { get; set; }

        public decimal? CurrentPrice { get; set; }

        public decimal? OverridePrice { get; set; }

        public decimal Amount { get; set; }

        public bool Sold { get; set; }

        public DateTime InvestedAt { get; set; }

        public DateTime? SoldAt { get; set; }
    }
}