using club.Models;
using Microsoft.AspNetCore.Mvc;

namespace club.Controllers;

[ApiController]
[Route("currency")]
public class CurrencyController : ExtendedController
{
    private readonly HttpClient _httpClient;
    private readonly ICurrencyService _currencyService;

    public CurrencyController(IHttpClientFactory httpClientFactory, ICurrencyService currencyService)
    {
        _httpClient = httpClientFactory.CreateClient();
        _currencyService = currencyService;
    }

    [HttpGet("rates")]
    public async Task<IActionResult> FxRates()
    {
        var rates = await _currencyService.FetchAndStoreCurrencyRatesAsync();
        return Ok(rates);
    }

    [HttpGet("getrates")]
    public async Task<ActionResult<IEnumerable<Currency>>> GetStoredRates()
    {
        var rates = await _currencyService.GetStoredCurrencyRatesAsync();
        return Ok(rates);
    }
}