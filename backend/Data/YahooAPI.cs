using HtmlAgilityPack;
namespace club.Data
{
    public static class YahooAPI
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
                string url = $"https://finance.yahoo.com/quote/{stockSymbol}?p={stockSymbol}";
                string stockPrice = await FetchStockPrice(url);

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

        private static async Task<string> FetchStockPrice(string url)
        {
            // Create an HttpClient instance
            using HttpClient client = new HttpClient();
            // Set realistic headers to mimic a browser
            client.DefaultRequestHeaders.Add("User-Agent",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
            // Fetch the HTML content of the page
            string htmlContent = await client.GetStringAsync(url);
            // Load the HTML content into HtmlAgilityPack
            var htmlDoc = new HtmlDocument();
            htmlDoc.LoadHtml(htmlContent);
            // Use XPath to locate the stock price element
            var stockPriceNode = htmlDoc.DocumentNode.SelectSingleNode("//fin-streamer[@data-field='regularMarketPrice']");
            return stockPriceNode?.InnerText.Trim() ?? "";
        }
    }
}
