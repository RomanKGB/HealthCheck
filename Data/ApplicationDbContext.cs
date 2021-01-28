using Microsoft.EntityFrameworkCore;
using HealthCheck.Data.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.Extensions.Options;
using HealthCheck.Data.Models;

namespace HealthCheck.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        
        public ApplicationDbContext(DbContextOptions options,IOptions<OperationalStoreOptions> operationalStorageOptions):base(options,operationalStorageOptions)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<City>().ToTable("Cities");
            modelBuilder.Entity<Country>().ToTable("Countries");
        }

        public DbSet<City> Cities { get; set; }
        public DbSet<Country> Countries { get; set; }

    }
}
