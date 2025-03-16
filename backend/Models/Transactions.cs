using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace club.Models
{
    public class Transaction
    {
        [Key] public int Id { get; set; }

        [Column(TypeName = "date")] public DateTime Date { get; set; } = DateTime.UtcNow; // Default to current UTC time

        [Required] [StringLength(100)] public string Type { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")] public decimal Amount { get; set; }
        
        public virtual Club Club { get; set; } = null!;
    }
}