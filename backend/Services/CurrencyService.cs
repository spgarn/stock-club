using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using club.Data;
using club.Models;

public interface ICurrencyService
{
    Task<List<Currency>> FetchAndStoreCurrencyRatesAsync();
    Task<List<Currency>> GetStoredCurrencyRatesAsync(); // New method
}

public class CurrencyService : ICurrencyService
{
    private readonly HttpClient _httpClient;
    private readonly MyDbContext _context;
    private readonly ILogger<CurrencyService> _logger;

    public CurrencyService(HttpClient httpClient, MyDbContext context, ILogger<CurrencyService> logger)
    {
        _httpClient = httpClient;
        _context = context;
        _logger = logger;
    }

    public async Task<List<Currency>> FetchAndStoreCurrencyRatesAsync()
    {
        var url = "https://api.fxratesapi.com/latest?currencies=EUR,SEK,USD,GBP,NOK,DKK&base=SEK";
        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Failed to fetch FX rates. Status Code: {StatusCode}", response.StatusCode);
            return new List<Currency>();
        }

        var content = await response.Content.ReadAsStringAsync();
        if (string.IsNullOrWhiteSpace(content))
        {
            _logger.LogError("Empty response received from FXRatesAPI.");
            return new List<Currency>();
        }

        var jsonResponse = JsonSerializer.Deserialize<FxResponse>(content,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (jsonResponse?.Rates == null)
        {
            _logger.LogError("Invalid response format from FXRatesAPI.");
            return new List<Currency>();
        }

        var currencies = jsonResponse.Rates
            .Select(rate => new Currency { Name = rate.Key, Rate = rate.Value })
            .ToList();

        foreach (var currency in currencies)
        {
            var existingCurrency = await _context.Currency.FirstOrDefaultAsync(c => c.Name == currency.Name);

            if (existingCurrency != null)
            {
                existingCurrency.Rate = currency.Rate;
            }
            else
            {
                _context.Currency.Add(currency);
            }
        }

        await _context.SaveChangesAsync();
        return currencies;
    }

    public async Task<List<Currency>> GetStoredCurrencyRatesAsync()
    {
        return await _context.Currency.ToListAsync();
    }
}

public class FxResponse
{
    public Dictionary<string, decimal> Rates { get; set; }
}