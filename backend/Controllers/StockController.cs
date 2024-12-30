using club.Data;
using club.Dtos;
using club.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace club.Controllers
{
    [ApiController]
    [Route("stocks")]
    public class StockController : ExtendedController
    {
        [HttpGet]
        [Authorize]
        [Route("all")]
        public async Task<ActionResult<ICollection<StockDto>>> GetStocks(
           [FromServices] MyDbContext context)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            var user = result.Value;
            if (user == null) return NotFound();
            var stocks = context.StockHolding.Include(stock => stock.Stock).Where(stocks => stocks.User.Id == user.Id).OrderByDescending(stock => stock.Id).ToArray();
            return Ok(stocks.Select(stock =>
                new StockDto
                {
                    Id = stock.Id,
                    Amount = stock.Amount,
                    SellPrice = stock.SellPrice,
                    BuyPrice = stock.BuyPrice,
                    InvestedAt = stock.InvestedAt,
                    Sold = stock.Sold,
                    StockName = stock.Stock.StockName,
                    SoldAt = stock.SoldAt,
                    CurrentPrice = stock.Stock.CurrentPrice//await YahooAPI.GetStock(club.StockName)
                }).ToList());
        }
        [HttpPost]
        [Authorize]
        [Route("add")]
        public async Task<ActionResult<string>> AddStock(
           [FromServices] MyDbContext context, StockDto stockDto)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound("Cookie Not Found");
            var user = result.Value;
            if (user == null) return NotFound("User Not Found");
            var stock = context.Stock.FirstOrDefault(stock => stock.StockName == stockDto.StockName);
            if (stock == null)
            {
                var validPrice = await YahooApi.GetStock(stockDto.StockName);
                if (validPrice == null)
                {
                    return NotFound("Stock Not Found"); //Can't find it
                }

                stock = new Stock
                {
                    StockName = stockDto.StockName,
                    CurrentPrice = validPrice.Value,
                    Active = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };
                context.Stock.Add(stock);

            }
            context.StockHolding.Add(new StockHolding
            {
                Amount = stockDto.Amount,
                SellPrice = stockDto.Sold ? stockDto.SellPrice : null,
                BuyPrice = stockDto.BuyPrice,
                StockName = stockDto.StockName,
                Sold = stockDto.Sold,
                InvestedAt = stockDto.InvestedAt,
                SoldAt = stockDto.SoldAt,
                User = user,
                Stock = stock
            });
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddStock), user.Id);
        }
        [HttpPut]
        [Authorize]
        [Route("edit/{stockId}")]
        public async Task<ActionResult<string>> EditStock(
           [FromServices] MyDbContext context, StockDto stockDto, int stockId)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            var user = result.Value;
            if (user == null) return NotFound();
            var stock = context.Stock.FirstOrDefault(stock => stock.StockName == stockDto.StockName);
            if (stock == null)
            {
                var validPrice = await YahooApi.GetStock(stockDto.StockName);
                if (validPrice == null)
                {
                    return NotFound("Stock Not Found"); //Can't find it
                }

                stock = new Stock
                {
                    StockName = stockDto.StockName,
                    CurrentPrice = validPrice.Value,
                    Active = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };
                context.Stock.Add(stock);

            }
            var existingStock = context.StockHolding.Include(stock => stock.Stock).FirstOrDefault(stock => stock.Id == stockId && stock.User.Equals(user));
            if (existingStock == null) return NotFound();
            existingStock.Amount = stockDto.Amount;
            existingStock.BuyPrice = stockDto.BuyPrice;
            existingStock.StockName = stockDto.StockName;
            existingStock.Sold = stockDto.Sold;
            existingStock.Stock = stock;
            if (stockDto.Sold)
            {
                existingStock.SellPrice = stockDto.SellPrice;
                existingStock.SoldAt = stockDto.SoldAt;
            }
            else
            {
                existingStock.SellPrice = null;
                existingStock.SoldAt = null;
            }

            context.StockHolding.Update(existingStock);
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(EditStock), user.Id);
        }

        [HttpPut]
        [Authorize]
        [Route("sellportion")]
        public async Task<ActionResult<string>> SellChunk(
           [FromServices] MyDbContext context, StockSplitForm stockDto)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            var user = result.Value;
            if (user == null) return NotFound();
            var existingStock = context.StockHolding.Include(stock => stock.Stock).FirstOrDefault(stock => stock.Id == stockDto.Id && stock.User.Equals(user));
            if (existingStock == null) return NotFound();
            if (existingStock.Amount < stockDto.Amount) return StatusCode(400); //Too many

            //Remove from current one
            existingStock.Amount -= stockDto.Amount;

            //Create a new from the amount split off
            var newSoldStock = new StockHolding
            {
                Amount = stockDto.Amount,
                SellPrice = stockDto.SellPrice,
                BuyPrice = existingStock.BuyPrice,
                StockName = existingStock.StockName,
                Sold = true,
                InvestedAt = existingStock.InvestedAt,
                SoldAt = stockDto.SoldAt,
                User = user,
                Stock = existingStock.Stock
            };

            context.StockHolding.Update(existingStock);
            context.StockHolding.Add(newSoldStock);
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(SellChunk), user.Id);
        }

        [HttpDelete]
        [Authorize]
        [Route("{id}")]
        public async Task<ActionResult<string>> DeleteStock(
          [FromServices] MyDbContext context, int id)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            var user = result.Value;
            if (user == null) return NotFound();
            if (user.Clubs.Count == 0) return NotFound();
            var existingStock = context.StockHolding.FirstOrDefault(stock => stock.Id == id && stock.User.Equals(user));
            if (existingStock == null) return NotFound();
            //Check if there is only 1 instance of this stock. If so delete it from Stock as well
            var stock = context.Stock.Include(stock => stock.StockHoldings).FirstOrDefault(stock => stock.StockName == existingStock.StockName);
            
            //Delete stock holding
            context.StockHolding.Remove(existingStock);
            if (stock is { StockHoldings.Count: 1 })
            {
                context.Stock.Remove(stock);
            }
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(DeleteStock), user.Id);
        }
    }
}