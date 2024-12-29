using club.Data;
using club.Dtos;
using club.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

            return Ok(stocks.Select(club =>
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
                     CurrentPrice = 100 //Inject current prices here
                 }).ToList());
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
    }
}