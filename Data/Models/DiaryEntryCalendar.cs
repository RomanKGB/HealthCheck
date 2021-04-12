using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HealthCheck.Data.Models
{
    public class DiaryEntryCalendar
    {
        public DiaryEntryCalendar()
        { }
        public DiaryEntryCalendar(string entry_text, string entry_date)
        {
            this.title = entry_text;
            this.date = entry_date;
        }

        public string title { get; set; }
        public string date { get; set; }
        
    }
}
