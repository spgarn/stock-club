using club.Data;
using Microsoft.EntityFrameworkCore;

namespace club.Jobs;

using Quartz;

public class UpdateStockJob(MyDbContext dbContext) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        var random = new Random();
        // Generate a random delay between 0 and 10 seconds (0 to 20000 milliseconds)
        var delay = random.Next(0, 20001); // 0 to 20000 milliseconds
        await Task.Delay(delay);
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