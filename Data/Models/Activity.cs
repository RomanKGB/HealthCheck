using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace HealthCheck.Data.Models
{
    public class Activity
    {
        public Activity() { }
        public Activity(int activity_id, string activity_name, int activity_points,int done)
        {
            this.activity_id = activity_id;
            this.activity_name = activity_name;
            this.activity_points = activity_points;
            this.done = done;
        }
        [Key]
        [Required]
        public int activity_id { get; set; }
        public string activity_name { get; set; }
        public int activity_points { get; set; }
        public int done { get; set; }
    }
}
