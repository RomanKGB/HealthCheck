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
            string strSQL = "select entry_id,entry_text,isnull(entry_color,'1') as entry_color,entry_date,entry_date_int from vDiary where " 
                + "convert(date, entry_date) between convert(date, '"+ dateFrom+"') and convert(date, '"+dateTo+"')";
            IQueryable<DiaryEntry> dbSetLocal = _context.DiaryEntries.FromSqlRaw<DiaryEntry>(strSQL);
            try
            {
                return await ApiResult<DiaryEntryDTO>.CreateAsync(
                    dbSetLocal
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
            catch(System.InvalidCastException e)
            {

                Console.WriteLine(e.Message);
                return null;
                
            }

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
                string strSQL = "select entry_id,entry_text,isnull(entry_color,'1') as entry_color,entry_date,entry_date_int from vDiary where "
                    + "convert(date, entry_date) between convert(date, '" + dateFrom + "') and convert(date, '" + dateTo + "')";


                DataTable dbTable = dbLayer.ExecuteQuery(strSQL);
                List<DiaryEntryCalendar> diaryList = new List<DiaryEntryCalendar>();
                diaryList = (from DataRow dr in dbTable.Rows
                             select new DiaryEntryCalendar()
                             {
                                 title = dr["entry_text"].ToString(),
                                 date = dr["entry_date"].ToString(),
                                 backgroundColor = getColor(dr["entry_color"].ToString()),
                                 id= dr["entry_id"].ToString()
                             }).ToList();

                 return new ApiResult<DiaryEntryCalendar>(diaryList, diaryList.Count, pageIndex, pageSize, sortColumn, sortOrder, filterColumn, filterQuery); ;
            });
        }

        [HttpPost]
        [Route("addactivity")]
        public async Task<ActionResult<bool>> AddActivity(int entry_id,int activity_id)
        {
            return await Task.Run(() =>
            {
                string strSQL = "insert into diary_activities (activity_id,entry_id) values (" + activity_id + "," + entry_id + ")";
                
                return dbLayer.ExecuteSQL(strSQL); 
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DiaryEntryCalendar>> GetDiary(string id)
        {
            return await Task.Run(() =>
            {
                string strSQL = "select entry_id,entry_text,isnull(entry_color,'1') as entry_color,entry_date,entry_date_int from vDiary where "
                    + "entry_id=" + id;
                DiaryEntryCalendar diaryEntry = new DiaryEntryCalendar();

                try
                {
                    DataTable dbTable = new DataLayer().ExecuteQuery(strSQL);
                    diaryEntry.id = id.ToString();
                    diaryEntry.title = dbTable.Rows[0]["entry_text"].ToString();
                    diaryEntry.date = dbTable.Rows[0]["entry_date"].ToString();
                    diaryEntry.backgroundColor=dbTable.Rows[0]["entry_color"].ToString();
                }
                catch (Exception e) { Console.Write(e.Message); }
                return diaryEntry;
            });
        }

        private string getColor(string color_value)
        {
            string entry_color = "";

            switch (color_value)
            {
                case "1":
                    entry_color = "red";
                    break;
                case "2":
                    entry_color = "orange";
                    break;
                case "3":
                    entry_color = "yellow";
                    break;
                case "4":
                    entry_color = "green";
                    break;
                case "5":
                    entry_color = "blue";
                    break;
                default:
                    entry_color = "red";
                    break;
            }

            return entry_color;        
        }

    }
}

