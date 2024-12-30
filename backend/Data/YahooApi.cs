using HtmlAgilityPack;
namespace club.Data
{
    public static class YahooApi
    {
        private class CacheEntry
        {
            public required string Price { get; set; }
            public DateTime Timestamp { get; set; }
        }

        private static readonly Dictionary<string, CacheEntry> _cache = new Dictionary<string, CacheEntry>();
        private static readonly TimeSpan _cacheDuration = TimeSpan.FromHours(1);

        public static async Task<decimal?> GetStock(string stockSymbol)
        {
            // Check if we have a valid cached entry
            if (_cache.TryGetValue(stockSymbol, out var cacheEntry))
            {
                if (DateTime.Now - cacheEntry.Timestamp < _cacheDuration)
                {
                    Console.WriteLine($"Returning cached price for {stockSymbol}: {cacheEntry.Price}");
                    return Convert.ToDecimal(cacheEntry.Price);
                }
            }
            try
            {
                // Define the stock symbol and URL
                var url = $"https://finance.yahoo.com/quote/{stockSymbol}?p={stockSymbol}";
                var stockPrice = await FetchStockPrice(url);

                if (!string.IsNullOrEmpty(stockPrice))
                {
                    // Update cache
                    _cache[stockSymbol] = new CacheEntry
                    {
                        Price = stockPrice,
                        Timestamp = DateTime.Now
                    };

                    Console.WriteLine($"The current stock price for {stockSymbol} is: {stockPrice}");
                    return Convert.ToDecimal(stockPrice);
                }
                else
                {
                    Console.WriteLine($"Unable to fetch stock price for {stockSymbol}.");
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                return null;
            }
        }

        private static async Task<string?> FetchStockPrice(string url)
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("User-Agent",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
            var htmlContent = await client.GetStringAsync(url);

            var htmlDoc = new HtmlDocument();
            htmlDoc.LoadHtml(htmlContent);

            // Check for errors or invalid stock symbols
            var errorNode = htmlDoc.DocumentNode.SelectSingleNode("//div[contains(@class, 'error')]");
            if (errorNode != null)
            {
                Console.WriteLine($"Error found on the page for stock symbol.");
                return null;
            }

            var stockPriceNode = htmlDoc.DocumentNode.SelectSingleNode("//div[contains(@class, 'price')]//fin-streamer[@data-field='regularMarketPrice']");
            if (stockPriceNode == null)
            {
                Console.WriteLine("Stock price element not found.");
                return null;
            }

            var stockPrice = stockPriceNode.InnerText.Trim();
            if (decimal.TryParse(stockPrice, out _)) return stockPrice;

            Console.WriteLine($"Extracted stock price is not valid: {stockPrice}");
            return null;
        }
    }
}
