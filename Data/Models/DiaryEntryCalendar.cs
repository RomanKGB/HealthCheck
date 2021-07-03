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
        public DiaryEntryCalendar(string entry_id,string entry_text, string entry_date,string backgroundColor,int weight)
        {
            this.title = entry_text;
            this.date = entry_date;
            this.id = entry_id;
            this.backgroundColor = backgroundColor;
            this.weight = weight;
        }

        public string title { get; set; }
        public string date { get; set; }
        public string backgroundColor { get; set; }
        public string id { get; set; }
        public int weight { get; set; }

    }
}
