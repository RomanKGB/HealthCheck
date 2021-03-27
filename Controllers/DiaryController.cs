﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HealthCheck.Data;
using HealthCheck.Data.Models;
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
                    EntryId = c.EntryId,
                    EntryText = c.EntryText,
                    EntryDate = c.EntryDate,
                    EntryColor = c.EntryColor
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

        /*[HttpGet("{id}")]
        public async Task<ActionResult<Country>> GetCountry(int id)
        {
            var country = await _context.DiaryEntries.FindAsync(id);

            if (country == null) return NotFound();

            return country;
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCountry(int id, Country country)
        {
            if (id != country.Id) return BadRequest();

            _context.Entry(country).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CountryExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Country>> PostCountry(Country country)
        {
            _context.DiaryEntries.Add(country);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCountry", new { id = country.Id }, country);
        }

        // DELETE: api/Countries/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Country>> DeleteCountry(int id)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null)
            {
                return NotFound();
            }

            _context.Countries.Remove(country);
            await _context.SaveChangesAsync();

            return country;
        }
        private bool CountryExists(int id)
        {
            return _context.Countries.Any(e => e.Id == id);
        }

        [HttpPost]
        [Route("IsDupeField")]
        public bool IsDupeField(int countryId, string fieldName, string fieldValue)
        {
            switch (fieldName)
            {
                case "name":
                    return _context.Countries.Any(c => c.Name == fieldValue && c.Id != countryId);
                case "iso2":
                    return _context.Countries.Any(c => c.ISO2 == fieldValue && c.Id != countryId);
                case "iso3":
                    return _context.Countries.Any(c => c.ISO3 == fieldValue && c.Id != countryId);
                default: return false;
            }
        }
        */
    }
}
