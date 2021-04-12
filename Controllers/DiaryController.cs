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

        public DiaryController(DiaryDbContext context)
        {
            _context = context;
            
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
                ); ;
            
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
        public async Task<ActionResult<ApiResult<DiaryEntryDTO>>> GetCalendarEvents(
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


                DataLayer dbLayer = new DataLayer();
                DataTable dbTable = dbLayer.ExecuteQuery(strSQL);
                List<DiaryEntryDTO> diaryList = new List<DiaryEntryDTO>();
                diaryList = (from DataRow dr in dbTable.Rows
                             select new DiaryEntryDTO()
                             {
                                 entry_id = Convert.ToInt32(dr["entry_id"]),
                                 entry_text = dr["entry_text"].ToString(),
                                 entry_color = dr["entry_color"].ToString(),
                                 entry_date = dr["entry_date"].ToString(),
                                 entry_date_int = 0
                             }).ToList();

                 return new ApiResult<DiaryEntryDTO>(diaryList, diaryList.Count, pageIndex, pageSize, sortColumn, sortOrder, filterColumn, filterQuery); ;
            });
        }

    }
}

