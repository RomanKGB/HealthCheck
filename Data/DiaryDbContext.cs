using Microsoft.EntityFrameworkCore;
using HealthCheck.Data.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.Extensions.Options;
using HealthCheck.Data.Models;

namespace HealthCheck.Data
{
    public class DiaryDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        
        public DiaryDbContext(DbContextOptions<DiaryDbContext> options,IOptions<OperationalStoreOptions> operationalStorageOptions):base(options,operationalStorageOptions)
        {
            //this.Database.
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<DiaryEntry>().ToTable("diary");
            modelBuilder.Entity<DiaryEntry>().ToView("vDiary"); 
            
        }

        public DbSet<DiaryEntry> DiaryEntries { get; set; }
        //public DbSet<DiaryEntry> DiaryEntriesFormatted { get; set; }

    }
}
