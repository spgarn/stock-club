using club.Data;
using Microsoft.EntityFrameworkCore;

namespace club.Jobs;

using Quartz;

public class UpdateStockJob(MyDbContext dbContext) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        Console.WriteLine("Updating stock prices...");

        var stocks = await dbContext.Stock.ToListAsync();

        foreach (var stock in stocks)
        {
            var price = await YahooApi.GetStock(stock.StockName);
            if (price != null)
            {
                stock.CurrentPrice = price.Value;
                stock.UpdatedAt = DateTime.UtcNow;
            }
        }

        await dbContext.SaveChangesAsync();
        Console.WriteLine("Stock prices updated.");
    }
}

public class SetOpeningPriceJob(MyDbContext dbContext) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        Console.WriteLine("Setting opening prices at 08:00 Swedish time...");

        var stocks = await dbContext.Stock.ToListAsync();

        foreach (var stock in stocks)
        {
            var price = await YahooApi.GetStock(stock.StockName);
            if (price != null)
            {
                stock.OpeningPrice = price.Value;
                stock.CurrentPrice = price.Value; // Ensure opening matches at start of the day
                stock.UpdatedAt = DateTime.UtcNow;
            }
        }

        await dbContext.SaveChangesAsync();
        Console.WriteLine("Opening prices updated.");
    }
}