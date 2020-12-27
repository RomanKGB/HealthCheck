using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthCheck.Data;
using OfficeOpenXml;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using HealthCheck.Data.Models;
using System.Text.Json;

namespace HealthCheck.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;
        public SeedController(ApplicationDbContext context,IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult> Import()
        {
            var path = Path.Combine(_env.ContentRootPath, String.Format("Data/Source/worldcities.xlsx"));

            using (var stream=new FileStream(
                path,FileMode.Open,FileAccess.Read))
            {
                using (var ep=new ExcelPackage(stream))
                {
                    var ws = ep.Workbook.Worksheets[0];
                    var nCountries = 0;
                    var nCities = 0;

                    var lstCountries = _context.Countries.ToList();

                    for (int nRow=2;nRow<=ws.Dimension.End.Row;nRow++)
                    {
                        var row = ws.Cells[nRow, 1, nRow, ws.Dimension.End.Column];
                        var name = row[nRow, 5].GetValue<string>();

                        //CONTINUE FROM HERE
                    }
                }
            }
        }
    }
}
