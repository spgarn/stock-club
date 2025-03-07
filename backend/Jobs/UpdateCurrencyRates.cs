using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace club.Jobs;

public class CurrencyUpdateJob : BackgroundService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<CurrencyUpdateJob> _logger;
    private readonly TimeSpan _updateInterval = TimeSpan.FromMinutes(10);

    public CurrencyUpdateJob(IServiceScopeFactory serviceScopeFactory, ILogger<CurrencyUpdateJob> logger)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    var currencyService = scope.ServiceProvider.GetRequiredService<ICurrencyService>();
                    await currencyService.FetchAndStoreCurrencyRatesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating currency rates.");
            }

            await Task.Delay(_updateInterval, stoppingToken);
        }
    }
}