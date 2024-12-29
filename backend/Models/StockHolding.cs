using System;
using System.Collections.Generic;

namespace club.Models;

public partial class StockHolding
{
    public int Id { get; set; }

    public string StockId { get; set; } = null!;

    public string StockName { get; set; } = null!;

    public decimal BuyPrice { get; set; }

    public decimal? SellPrice { get; set; }

    public decimal Amount { get; set; }

    public bool Sold { get; set; }

    //public int UserId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime InvestedAt { get; set; }

    public DateTime? SoldAt { get; set; }

    public virtual ApplicationUser User { get; set; } = null!;
}
