namespace HealthCheck.Data
{
    public class DiaryEntryDTO
    {
        public DiaryEntryDTO() { }

        public int EntryId { get; set; }
        public string EntryText { get; set; }
        public string EntryColor { get; set; }
        public string EntryDate { get; set; }
        public int EntryDateInt { get; set; }
        
    }
}