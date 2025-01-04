using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace club.Models;

public partial class StockHolding
{
    public int Id { get; set; }

    public Stock Stock { get; set; } = null!;
    
    [MaxLength(50)]
    public string? StockName { get; set; } //Optional

    public decimal BuyPrice { get; set; }

    public decimal? SellPrice { get; set; }

    public decimal Amount { get; set; }
    
    public decimal? OverridePrice { get; set; } //Used to override the price if that is needed

    public bool Sold { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime InvestedAt { get; set; }

    public DateTime? SoldAt { get; set; }

    public virtual ApplicationUser User { get; set; } = null!;
    
    public virtual Club Club { get; set; } = null!;
}
