using System.ComponentModel.DataAnnotations;

namespace HealthCheck.Data.Models
{
    public class DiaryEntry
    {
        public DiaryEntry()
        { }
        public DiaryEntry(int entry_id,string entry_text,string entry_date,string entry_color,string entry_date_int)
        {
            this.entry_id = entry_id;
            this.entry_text = entry_text;
            this.entry_date = entry_date;
            this.entry_color = entry_color;
            this.entry_date_int = entry_date_int;

        }

        [Key]
        [Required]
        public int entry_id { get; set; }
        public string entry_text { get; set; }
        public string entry_date { get; set; }
        public string entry_color { get; set; }
        public string entry_date_int { get; set; }

    }
}
