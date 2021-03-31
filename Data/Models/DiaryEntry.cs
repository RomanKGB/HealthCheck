using System.ComponentModel.DataAnnotations;

namespace HealthCheck.Data.Models
{
    public class DiaryEntry
    {
        public DiaryEntry()
        { }
        [Key]
        [Required]
        public int entry_id { get; set; }
        public string entry_text { get; set; }
        public string entry_date { get; set; }
        public string entry_color { get; set; }
        public string entry_date_int { get; set; }

    }
}
