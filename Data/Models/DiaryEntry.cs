using System.ComponentModel.DataAnnotations;

namespace HealthCheck.Data.Models
{
    public class DiaryEntry
    {
        public DiaryEntry()
        { }
        [Key]
        [Required]
        public int EntryId { get; set; }
        public string EntryText { get; set; }
        public string EntryColor { get; set; }
        public string EntryDate { get; set; }
        public int EntryDateInt { get; set; }

    }
}
