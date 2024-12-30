using club.Data;
using Microsoft.EntityFrameworkCore;

namespace club.Jobs;

using Quartz;

public class UpdateStockJob(MyDbContext dbContext) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        var stock = await dbContext.Stock.OrderBy(stock => stock.UpdatedAt).FirstOrDefaultAsync();
        Console.WriteLine("Retrieving stocks");
        if (stock != null)
        {
            //Get updated price
            var price = await YahooApi.GetStock(stock.StockName);
            if (price != null)
            {
                stock.CurrentPrice = price.Value;
            }
            stock.UpdatedAt = DateTime.UtcNow;
            dbContext.Update(stock);
            await dbContext.SaveChangesAsync();
        }
    }
}