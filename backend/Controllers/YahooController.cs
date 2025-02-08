using System.Text.Json;
using club.Data;
using club.Dtos;
using club.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace club.Controllers
{
    [ApiController]
    [Route("yahoo")]
    public class YahooController : Controller
    {
        private readonly HttpClient _httpClient;

        public YahooController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet("info")]
        [Authorize] // If you don't need authentication, remove this
        public async Task<ActionResult<YahooDTO>> GetYahooStockInfo([FromQuery] string ISIN)
        {
            if (string.IsNullOrEmpty(ISIN))
            {
                return BadRequest("ISIN parameter is required.");
            }

            string yahooApiUrl = $"https://query1.finance.yahoo.com/v1/finance/search?q={ISIN}&quotesCount=1&newsCount=0&listsCount=0&quotesQueryId=tss_match_phrase_query";
            Console.WriteLine(yahooApiUrl);
            try
            {
                using var request = new HttpRequestMessage(HttpMethod.Get, yahooApiUrl);
        
                // Set headers to mimic a real browser request
                request.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
                request.Headers.Add("Accept", "application/json");
                request.Headers.Add("Referer", "https://www.yahoo.com");
                request.Headers.Add("Origin", "https://www.yahoo.com");

                HttpResponseMessage response = await _httpClient.SendAsync(request);
            
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine(response.ReasonPhrase);
                    return StatusCode((int)response.StatusCode, "Error fetching data from Yahoo Finance.");
                }

                var jsonResponse = await response.Content.ReadAsStringAsync();
                var yahooData = JsonSerializer.Deserialize<YahooDTO>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return Ok(yahooData);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, $"Request error: {ex.Message}");
            }
        }
    }
}