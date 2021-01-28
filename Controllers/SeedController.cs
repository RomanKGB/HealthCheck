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
using Microsoft.AspNetCore.Identity;

namespace HealthCheck.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _env;
        public SeedController(
            ApplicationDbContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            IWebHostEnvironment env)
        {
            _context = context;
            _roleManager = roleManager;
            _userManager = userManager;
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

                        if (lstCountries.Where(c=>c.Name==name).Count()==0)
                        {
                            var country = new Country();
                            country.Name = name;
                            country.ISO2 = row[nRow, 6].GetValue<string>();
                            country.ISO2 = row[nRow, 7].GetValue<string>();

                            _context.Countries.Add(country);
                            await _context.SaveChangesAsync();
                            lstCountries.Add(country);

                            nCountries++;

                            
                        }
                    }

                    for (int nRow = 2; nRow <= ws.Dimension.End.Row; nRow++)
                    {
                        var row = ws.Cells[nRow, 1, nRow, ws.Dimension.End.Column];

                        var city=new City();
                        city.Name = row[nRow, 1].GetValue<string>();
                        city.Name_ASCII = row[nRow, 2].GetValue<string>();
                        city.Lat = row[nRow, 3].GetValue<decimal>();
                        city.Lon = row[nRow, 3].GetValue<decimal>();

                        var countryName = row[nRow, 5].GetValue<string>();
                        var country = lstCountries.Where(c => c.Name == countryName).FirstOrDefault();

                        city.CountryId = country.Id;

                        _context.Cities.Add(city);
                        await _context.SaveChangesAsync();
                        nCities++;

                    }
                    return new JsonResult(new { Cities = nCities, Countries = nCountries });
                }
            }
        }

        [HttpGet]
        public async Task<ActionResult> CreateDefaultUsers()
        {
            throw new NotImplementedException();
        }
    }
}
