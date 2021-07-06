using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HealthCheck.Data;
using HealthCheck.Data.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.AspNetCore.Authorization;

namespace HealthCheck.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiaryController : ControllerBase
    {
        private readonly DiaryDbContext _context;
        private DataLayer dbLayer;
        public DiaryController(DiaryDbContext context)
        {
            _context = context;
            dbLayer = new DataLayer();
        }

        [HttpGet]
        
        public async Task<ActionResult<ApiResult<DiaryEntryDTO>>> GetDiaries(
            int pageIndex = 0,
            int pageSize = 10,
            string sortColumn = null,
            string sortOrder = null,
            string filterColumn = null,
            string filterQuery = null
            )
        {
            return await ApiResult<DiaryEntryDTO>.CreateAsync(
                _context.DiaryEntries
                .Select(c => new DiaryEntryDTO()
                {
                    entry_id = c.entry_id,
                    entry_text = c.entry_text,
                    entry_date = c.entry_date,
                    entry_color = c.entry_color.ToString()
                    //TotalEntries = _context.DiaryEntries.Count<DiaryEntry>
                }),
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery
                ); 
            
        }

        
        [HttpGet]
        [Route("GetRange")]
        public async Task<ActionResult<ApiResult<DiaryEntryDTO>>> GetDiariesRange(
            int pageIndex = 0,
            int pageSize = 10,
            string sortColumn = null,
            string sortOrder = null,
            string filterColumn = null,
            string filterQuery = null,
            string dateFrom=null,
            string dateTo=null
            )
        {

            return await Task.Run(() =>
            {
                //string strSQL = "select entry_id,entry_text,isnull(entry_color,'1') as entry_color,entry_date,entry_date_int from vDiary where "
                //    + "convert(date, entry_date) between convert(date, '" + dateFrom + "') and convert(date, '" + dateTo + "')";

                string strSQL = "select d.entry_id,d.entry_text,isnull(SUM(a.activity_points),0) as days_points,d.entry_date,d.entry_date_int from vDiary d left outer join diary_activities da on d.entry_id=da.entry_id "
                + "left outer join activity a on a.activity_id = da.activity_id where convert(date, entry_date) between convert(date, '" + dateFrom + "') and convert(date, '" + dateTo + "') "
                + "group by d.entry_id,d.entry_text,d.entry_date,d.entry_date_int";

                DataTable dbTable = dbLayer.ExecuteQuery(strSQL);
                List<DiaryEntryDTO> diaryList = new List<DiaryEntryDTO>();
                diaryList = (from DataRow dr in dbTable.Rows
                             select new DiaryEntryDTO()
                             {
                                 entry_id = int.Parse(dr["entry_id"].ToString()),
                                 entry_date = dr["entry_date"].ToString(),
                                 entry_color = getColor(dr["days_points"].ToString()),
                                 entry_text = dr["entry_text"].ToString(),
                                 total_points= int.Parse(dr["days_points"].ToString())
                             }).ToList();

                return new ApiResult<DiaryEntryDTO>(diaryList, diaryList.Count, pageIndex, pageSize, sortColumn, sortOrder, filterColumn, filterQuery);
            });
            



        }

        [HttpGet]
        [Route("GetCalendarEvents")]
        public async Task<ActionResult<ApiResult<DiaryEntryCalendar>>> GetCalendarEvents(
            int pageIndex = 0,
            int pageSize = 10,
            string sortColumn = null,
            string sortOrder = null,
            string filterColumn = null,
            string filterQuery = null,
            string dateFrom = null,
            string dateTo = null
            )
        {

            return await Task.Run(() =>
            {
                //string strSQL = "select entry_id,entry_text,isnull(entry_color,'1') as entry_color,entry_date,entry_date_int from vDiary where "
                //    + "convert(date, entry_date) between convert(date, '" + dateFrom + "') and convert(date, '" + dateTo + "')";

                string strSQL = "select d.entry_id,d.entry_text,isnull(SUM(case da.done when 1 then a.activity_points else 0 end),0) as days_points,"
                + "isnull(SUM(a.activity_points), 0) as days_planned_points,isnull(sum(case da.done when 1 then 1 else 0 end),0) as done_activities,isnull(count(da.activity_id),0) as num_activities,dbo.fnFormatDate (d.entry_date, 'YYYY-MM-DD') as entry_date,d.entry_date_int "
                + "from vDiary d left outer join diary_activities da on d.entry_id=da.entry_id "
                + "left outer join activity a on a.activity_id = da.activity_id where convert(date, entry_date) between convert(date, '" + dateFrom + "') and convert(date, '" + dateTo + "') "
                + "group by d.entry_id,d.entry_text,d.entry_date,d.entry_date_int";

                DataTable dbTable = dbLayer.ExecuteQuery(strSQL);
                List<DiaryEntryCalendar> diaryList = new List<DiaryEntryCalendar>();
                diaryList = (from DataRow dr in dbTable.Rows
                             select new DiaryEntryCalendar()
                             {
                                 title = dr["days_points"].ToString()+"/"+ dr["days_planned_points"].ToString()+"  -  "+dr["done_activities"].ToString() + "/" + dr["num_activities"].ToString(),
                                 date = dr["entry_date"].ToString(),
                                 backgroundColor = getColor(dr["days_points"].ToString()),
                                 id= dr["entry_id"].ToString()
                             }).ToList();

                 return new ApiResult<DiaryEntryCalendar>(diaryList, diaryList.Count, pageIndex, pageSize, sortColumn, sortOrder, filterColumn, filterQuery); 
            });
        }

        [HttpGet]
        [Route("getactivities")]
        public async Task<ActionResult<ApiResult<Activity>>> GetActivities(string entry_id)
        {

            return await Task.Run(() =>
            {
                //string strSQL = "select activity_id,activity_name,activity_points from activity where activity_id not in (select activity_id from diary_activities where entry_id="+entry_id+") order by activity_name";

                string strSQL = "select a.activity_id,activity_name,activity_points,count(da.activity_id) as times_added from activity a "
                    + "left outer join diary_activities da on a.activity_id = da.activity_id "
                    + "where a.activity_id not in (select activity_id from diary_activities where entry_id = "+entry_id+") "
                    + "group by a.activity_id,activity_name,activity_points "
                    + "order by times_added desc,activity_name";


                DataTable dbTable = dbLayer.ExecuteQuery(strSQL);
                List<Activity> activityList = new List<Activity>();
                activityList = (from DataRow dr in dbTable.Rows
                             select new Activity()
                             {
                                 activity_id = Int32.Parse(dr["activity_id"].ToString()),
                                 activity_name = dr["activity_name"].ToString(),
                                 activity_points = Int32.Parse(dr["activity_points"].ToString()),
                                 done=0
                             }).ToList();

                return new ApiResult<Activity>(activityList, activityList.Count,1,100,null,null,null,null); 
            });
        }

        [HttpGet]
        [Route("gettoptenmonths")]
        public async Task<ActionResult<ApiResult<Top10Months>>> GetTop10Months()
        {

            return await Task.Run(() =>
            {
                //string strSQL = "select activity_id,activity_name,activity_points from activity where activity_id not in (select activity_id from diary_activities where entry_id="+entry_id+") order by activity_name";

                string strSQL = "dbo.getTop10Months";


                DataTable dbTable = dbLayer.ExecuteQuery(strSQL);
                List<Top10Months> activityList = new List<Top10Months>();
                activityList = (from DataRow dr in dbTable.Rows
                                select new Top10Months()
                                {
                                    diary_month= dr["diary_month"].ToString(),
                                    diary_year= dr["diary_year"].ToString(),
                                    avg_points_completed=int.Parse(dr["avg_points_completed"].ToString())
                                }).ToList();

                return new ApiResult<Top10Months>(activityList, activityList.Count, 1, 100, null, null, null, null);
            });
        }

        [HttpGet]
        [Route("getentryactivities")]
        public async Task<ActionResult<ApiResult<Activity>>> GetEntryActivities(int entry_id)
        {

            return await Task.Run(() =>
            {
                string strSQL = "select a.activity_id  as activity_id,a.activity_name,a.activity_points,da.done from "
                +" activity a inner join diary_activities da on da.activity_id = a.activity_id and da.entry_id = "+entry_id +" order by activity_name";


                DataTable dbTable = dbLayer.ExecuteQuery(strSQL);
                List<Activity> activityList = new List<Activity>();
                activityList = (from DataRow dr in dbTable.Rows
                                select new Activity()
                                {
                                    activity_id = Int32.Parse(dr["activity_id"].ToString()),
                                    activity_name = dr["activity_name"].ToString(),
                                    activity_points = Int32.Parse(dr["activity_points"].ToString()),
                                    done = Int32.Parse(dr["done"].ToString())
                                }).ToList();

                return new ApiResult<Activity>(activityList, activityList.Count, 0, 0, "", "", "", "");
            });
        }

        [HttpPost]
        [Route("addactivity")]
        public async Task<ActionResult<bool>> AddActivity(int entry_id,string activity_id)
        {
            return await Task.Run(() =>
            {
                string strSQL = "";
                bool allok = false;
                string[] arrVariables=activity_id.Split(",");

                for (int i = 0; i < arrVariables.Length-1; i++)
                {
                    strSQL = "insert into diary_activities (activity_id,entry_id) values (" + arrVariables[i] + "," + entry_id + ")";
                    allok= dbLayer.ExecuteSQL(strSQL);
                }
                return allok; 
            });
        }

        [HttpPost]
        [Route("addnewentry")]
        public async Task<ActionResult<int>> AddNewEntry(string entry_date)
        {
            return await Task.Run(() =>
            {
                string strSQL;
                bool allok = false ;
                int retVal = 0;
                DateTime dateFromString = DateTime.Parse(entry_date, System.Globalization.CultureInfo.InvariantCulture);
                dateFromString.ToString("MM/dd/yyyy");
                DataTable dbTable =dbLayer.ExecuteQuery("SELECT entry_id from diary where convert(date,entry_date)=convert(date,'"+ dateFromString.ToString("MM/dd/yyyy") + "')");
                if (dbTable.Rows.Count > 0) retVal = int.Parse(dbTable.Rows[0]["entry_id"].ToString());
                else
                {
                    dbTable = dbLayer.ExecuteQuery("SELECT MAX(entry_id) as max_id from diary");
                    if (dbTable.Rows.Count > 0) retVal = int.Parse(dbTable.Rows[0]["max_id"].ToString());
                    retVal += 1;
                    strSQL = "insert into diary (entry_id,entry_text,entry_date,entry_date_int) values (" + retVal.ToString() + ",'Please enter comments for " + entry_date + "','"
                        + entry_date + "',datediff(second,'1969/12/31 00:00:00','" + entry_date + " 00:00:00'))";

                    allok = dbLayer.ExecuteSQL(strSQL);
                }
                return retVal;
            });
        }

        [HttpPost]
        [Route("deleteactivity")]
        public async Task<ActionResult<bool>> DeleteActivity(int entry_id, string activity_id)
        {
            return await Task.Run(() =>
            {
                string strSQL = "";
                bool allok = false;
                string[] arrVariables = activity_id.Split(",");

                for (int i = 0; i < arrVariables.Length - 1; i++)
                {
                    strSQL = "delete from diary_activities where activity_id=" + arrVariables[i] + " and entry_id=" + entry_id;
                    allok = dbLayer.ExecuteSQL(strSQL);
                }
                return allok;
            });
        }

        [HttpPost]
        [Route("markdone")]
        public async Task<ActionResult<bool>> MarkDone(int entry_id, string activity_id,int is_done)
        {
            return await Task.Run(() =>
            {
                string strSQL = "";
                bool allok = false;
                string[] arrVariables = activity_id.Split(",");

                for (int i = 0; i < arrVariables.Length - 1; i++)
                {
                    strSQL = "update diary_activities set done="+is_done+" where activity_id=" + arrVariables[i] + " and entry_id=" + entry_id;
                    allok = dbLayer.ExecuteSQL(strSQL);
                }
                return allok;
            });
        }

        [HttpPost]
        [Route("addnewactivity")]
        public async Task<ActionResult<bool>> AddNewActivity(string activity_name, int activity_points )
        {
            return await Task.Run(() =>
            {
                string strSQL = "insert into activity (activity_name,activity_points) values ('" + activity_name + "'," + activity_points + ")";

                return dbLayer.ExecuteSQL(strSQL);
            });
        }

        [HttpPost]
        [Route("updatecomment")]
        public async Task<ActionResult<bool>> UpdateComment(string comment, int weight,int entry_id)
        {
            return await Task.Run(() =>
            {
                string strSQL = "update diary set entry_text='" + comment.Replace("'", "''") + "',my_weight="+ weight + " where entry_id=" + entry_id;

                return dbLayer.ExecuteSQL(strSQL);
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DiaryEntryCalendar>> GetDiary(string id)
        {
            return await Task.Run(() =>
            {
                string strSQL = "select entry_id,entry_text,isnull(entry_color,'1') as entry_color,entry_date,entry_date_int,my_weight from vDiary where "
                    + "entry_id=" + id;
                DiaryEntryCalendar diaryEntry = new DiaryEntryCalendar();

                try
                {
                    DataTable dbTable = new DataLayer().ExecuteQuery(strSQL);
                    diaryEntry.id = id.ToString();
                    diaryEntry.title = dbTable.Rows[0]["entry_text"].ToString();
                    diaryEntry.date = dbTable.Rows[0]["entry_date"].ToString();
                    diaryEntry.backgroundColor=dbTable.Rows[0]["entry_color"].ToString();
                    diaryEntry.weight = int.Parse(dbTable.Rows[0]["my_weight"].ToString());
                }
                catch (Exception e) { Console.Write(e.Message); }
                return diaryEntry;
            });
        }

        private string getColor(string color_value)
        {
            int days_points = int.Parse(color_value);

            if (days_points >= 150) return "blue";
            if (days_points >= 139) return "green";
            if (days_points >= 129) return "yellow";
            if (days_points >= 119) return "orange";
            else return "red";
        }

    }
}

