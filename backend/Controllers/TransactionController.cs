using club.Data;
using club.Dtos;
using club.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace club.Controllers
{
    [ApiController]
    [Route("transactions")]
    public class TransactionController : ExtendedController
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<TransactionController> _logger;

        // Inject IHttpClientFactory to create HttpClient instances.
        public TransactionController(IHttpClientFactory httpClientFactory, ILogger<TransactionController> logger)
        {
            _httpClient = httpClientFactory.CreateClient();
            _logger = logger;
        }

        [HttpPost]
        [Authorize]
        [Route("add/{clubId}")]
        public async Task<ActionResult<string>> AddTransaction(
            [FromServices] MyDbContext context, TransactionDTO transactionDto, int clubId)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound("Cookie Not Found");
            var user = result.Value;
            if (user == null) return NotFound("User Not Found");
            var club = user.Clubs.FirstOrDefault(c => c.Id == clubId);
            if (club == null) return NotFound();

            context.Transaction.Add(new Transaction
            {
                Amount = transactionDto.Amount,
                Date = transactionDto.Date,
                Type = transactionDto.Type,
                Club = club
            });
            
        
            
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddTransaction), user.Id);
        }
        
        [HttpGet]
        [Route("all/{clubId}")]
        public async Task<ActionResult<ICollection<TransactionDTO>>> GetTransactions(
            [FromServices] MyDbContext context, int clubId)
        {
            var publicClub = context.Club.FirstOrDefault(c => c.Id == clubId);
            var isPublic = publicClub != null && publicClub.PublicInvestments;
            if (!isPublic)
            {
                var result = await GetCurrentUser(context);
                if (result.Result != null) // If it's an error result
                    return result.Result;
                if (result.Value == null) return NotFound();
                var user = result.Value;
                if (user == null) return NotFound();

                var club = user.Clubs.FirstOrDefault(c => c.Id == clubId);
                if (club == null) return NotFound();
            }

            var transactions = context.Transaction.Where(transaction => transaction.Club.Id == clubId)
                .OrderByDescending(transactions => transactions.Id).ToArray();
            return Ok(transactions.Select(transactions =>
                new TransactionDTO
                {
                    Amount = transactions.Amount,
                    Date = transactions.Date,
                    Type = transactions.Type,
                }).ToList());
        }
    }
}