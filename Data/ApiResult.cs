using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using System.Reflection;


namespace HealthCheck.Data
{
    public class ApiResult<T>
    {
        public ApiResult(
            List<T> data,
            int count,
            int pageIndex,
            int pageSize,
            string sortColumn,
            string sortOrder,
            string filterColumn,
            string filterQuery
            )
        {
            Data = data;
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalCount = count;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            SortColumn = sortColumn;
            SortOrder = sortOrder;
            FilterColumn = filterColumn;
            FilterQuery = filterQuery;
        }

        public static async Task<ApiResult<T>> CreateAsync(
            IQueryable<T> source,
            int pageIndex,
            int pageSize,
            string sortColumn=null,
            string sortOrder=null,
            string filterColumn=null,
            string filterQuery=null
            )
        {
            var count = await source.CountAsync();


            if(!String.IsNullOrEmpty(filterColumn) && !String.IsNullOrEmpty(filterQuery) && IsValidProperty(filterColumn))
            {
                source = source.Where(String.Format("{0}.Contains(@0)", filterColumn), filterQuery);
            }

            if (!String.IsNullOrEmpty(sortColumn) && IsValidProperty(sortColumn))
            {
                sortOrder = !String.IsNullOrEmpty(sortOrder) && sortOrder.ToUpper() == "ASC" ? "ASC" : "DESC";
                if (sortColumn == "entry_date")
                {
                    source = source.OrderBy(String.Format("{0} {1}", sortColumn, sortOrder));
                }
                else
                    source = source.OrderBy(String.Format("{0} {1}", sortColumn, sortOrder)); 
                
            }
            
            source = source
                .Skip(pageIndex * pageSize)
                .Take(pageSize);

#if DEBUG
            {
                //var sql = source.ToSql();
            }
#endif
            var data = await source.ToListAsync();

            return new ApiResult<T>(data, count, pageIndex, pageSize,sortColumn,sortOrder,filterColumn,filterQuery);
        }



        public static bool IsValidProperty(string propertyName,bool throwExceptionIfNotFound=true)
        {
            var prop = typeof(T).GetProperty(
                propertyName,
                BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Static | BindingFlags.Instance);

            if (prop == null && throwExceptionIfNotFound)
                throw new NotSupportedException(String.Format("ERROR:Property {0} not found", propertyName));
            return prop != null;
        }
        public List<T> Data { get; private set; }
        public int PageIndex { get; private set; }
        public int PageSize { get; private set; }
        public int TotalCount { get; private set; }
        public int TotalPages { get; private set; }
        public string SortColumn { get; set; }
        public string SortOrder { get; set; }
        public string FilterColumn { get; set; }
        public string FilterQuery { get; set; }


        public bool HasPreviousPage
        {
            get
            {
                return PageIndex > 0;
            }
        }

        public bool HasNextPage
        {
            get
            {
                return ((PageIndex + 1) < TotalPages);
            }
        }
    }
}
