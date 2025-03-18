using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace club.Models;

[Index(nameof(StockName), IsUnique = true)]
public partial class Stock
{
    public int Id { get; set; }

    [MaxLength(50)] public required string StockName { get; set; }

    public required decimal CurrentPrice { get; set; }

    public required decimal OpeningPrice { get; set; } = 0.0m;
    public required bool Active { get; set; }

    public required DateTime CreatedAt { get; set; }

    public required DateTime UpdatedAt { get; set; }

    public virtual ICollection<StockHolding> StockHoldings { get; set; } = new List<StockHolding>();
}