using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HealthCheck.Data.Models
{
    public class Top10Months
    {
        public Top10Months()
        { }
        public Top10Months(string diary_month, string diary_year, int avg_points_completed, int average_weight)
        {
            this.diary_month = diary_month;
            this.diary_year = diary_year;
            this.avg_points_completed = avg_points_completed;
            this.average_weight = average_weight;
        }


        public int average_weight { get; set; }
        public int avg_points_completed { get; set; }
        public string diary_month { get; set; }
        public string diary_year { get; set; }
        
    }
}
