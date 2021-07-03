namespace HealthCheck.Data
{
    public class DiaryEntryDTO
    {
        public DiaryEntryDTO() { }

        public int entry_id { get; set; }
        public string entry_text { get; set; }
        public string entry_color { get; set; }
        public string entry_date { get; set; }
        public int entry_date_int { get; set; }

        public int total_points { get; set; }

    }
}