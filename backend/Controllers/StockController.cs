using club.Data;
using club.Dtos;
using club.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace club.Controllers
{
    [ApiController]
    [Route("stocks")]
    public class StockController : ExtendedController
    {
        [HttpGet]
        [Authorize]
        [Route("all")]
        public async Task<ActionResult<ICollection<StockDTO>>> GetStocks(
           [FromServices] MyDbContext _context)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;

            var stocks = _context.StockHolding.Where(stocks => stocks.User.Id == user.Id).OrderByDescending(stock => stock.Id).ToArray();

            var tasks = stocks.Select(async club =>
                new StockDTO
                {
                    Id = club.Id,
                    Amount = club.Amount,
                    SellPrice = club.SellPrice,
                    BuyPrice = club.BuyPrice,
                    InvestedAt = club.InvestedAt,
                    Sold = club.Sold,
                    StockId = club.StockId,
                    StockName = club.StockName,
                    SoldAt = club.SoldAt,
                    CurrentPrice = await YahooAPI.GetStock(club.StockName)
                });

            var results = await Task.WhenAll(tasks);
            return Ok(results.ToList());
        }
        [HttpPost]
        [Authorize]
        [Route("add")]
        public async Task<ActionResult<string>> AddStock(
           [FromServices] MyDbContext _context, StockDTO stockDTO)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;
            _context.StockHolding.Add(new StockHolding
            {
                Amount = stockDTO.Amount,
                SellPrice = stockDTO.Sold ? stockDTO.SellPrice : null,
                BuyPrice = stockDTO.BuyPrice,
                StockId = stockDTO.StockId,
                StockName = stockDTO.StockName,
                Sold = stockDTO.Sold,
                InvestedAt = stockDTO.InvestedAt,
                SoldAt = stockDTO.SoldAt,
                User = user
            });
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddStock), user.Id);
        }
        [HttpPut]
        [Authorize]
        [Route("edit/{stockId}")]
        public async Task<ActionResult<string>> EditStock(
           [FromServices] MyDbContext _context, StockDTO stockDTO, int stockId)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;
            var existingStock = _context.StockHolding.Where(stock => stock.Id == stockId && stock.User.Equals(user)).FirstOrDefault();
            if (existingStock == null) return NotFound();
            existingStock.Amount = stockDTO.Amount;
            existingStock.BuyPrice = stockDTO.BuyPrice;
            existingStock.StockId = stockDTO.StockId;
            existingStock.StockName = stockDTO.StockName;
            existingStock.Sold = stockDTO.Sold;
            if (stockDTO.Sold)
            {
                existingStock.SellPrice = stockDTO.SellPrice;
                existingStock.SoldAt = stockDTO.SoldAt;
            }
            else
            {
                existingStock.SellPrice = null;
                existingStock.SoldAt = null;
            }

            _context.StockHolding.Update(existingStock);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(EditStock), user.Id);
        }

        [HttpPut]
        [Authorize]
        [Route("sellportion")]
        public async Task<ActionResult<string>> SellChunk(
           [FromServices] MyDbContext _context, StockSplitForm stockDTO)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;
            var existingStock = _context.StockHolding.Where(stock => stock.Id == stockDTO.Id && stock.User.Equals(user)).FirstOrDefault();
            if (existingStock == null) return NotFound();
            if (existingStock.Amount < stockDTO.Amount) return StatusCode(400); //Too many

            //Remove from current one
            existingStock.Amount -= stockDTO.Amount;

            //Create a new from the amount split off
            var newSoldStock = new StockHolding
            {
                Amount = stockDTO.Amount,
                SellPrice = stockDTO.SellPrice,
                BuyPrice = existingStock.BuyPrice,
                StockId = existingStock.StockId,
                StockName = existingStock.StockName,
                Sold = true,
                InvestedAt = existingStock.InvestedAt,
                SoldAt = stockDTO.SoldAt,
                User = user
            };

            _context.StockHolding.Update(existingStock);
            _context.StockHolding.Add(newSoldStock);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(SellChunk), user.Id);
        }

        [HttpDelete]
        [Authorize]
        [Route("{id}")]
        public async Task<ActionResult<string>> DeleteStock(
          [FromServices] MyDbContext _context, int id)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;
            if (user.Clubs.Count == 0) return NotFound();
            var existingStock = _context.StockHolding.Where(stock => stock.Id == id && stock.User.Equals(user)).FirstOrDefault();
            if (existingStock == null) return NotFound();
            _context.StockHolding.Remove(existingStock);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(DeleteStock), user.Id);
        }
    }
}