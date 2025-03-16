using club.Models;

namespace club.Dtos;

public class TransactionDTO
{
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = null!;
}