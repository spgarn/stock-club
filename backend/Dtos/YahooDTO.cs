namespace club.Dtos;

public class YahooDTO
{
    public int Count { get; set; }
    public List<Quote> Quotes { get; set; }
}

public class Quote
{
    public string Exchange { get; set; }
    public string Shortname { get; set; }
    public string QuoteType { get; set; }
    public string Symbol { get; set; }
    public string Index { get; set; }
    public double Score { get; set; }
    public string TypeDisp { get; set; }
    public string ExchDisp { get; set; }
    public string Sector { get; set; }
    public string DesctorDisp { get; set; }
    public string Industry { get; set; }
    public string IndustryDisp { get; set; }
    public bool IsYahooFinance { get; set; }
}