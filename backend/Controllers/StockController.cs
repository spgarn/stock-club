using club.Data;
using club.Dtos;
using club.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
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
                     StockName = club.StockName
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
                SellPrice = stockDTO.SellPrice,
                BuyPrice = stockDTO.BuyPrice,
                StockId = stockDTO.StockId,
                StockName = stockDTO.StockName,
                Sold = stockDTO.Sold,
                InvestedAt = stockDTO.InvestedAt,
                User = user
            });
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddStock), user.Id);
        }
    }
}