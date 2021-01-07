using Microsoft.EntityFrameworkCore;
using HealthCheck.Data.Models;

namespace HealthCheck.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext():base()
        {

        }

        public ApplicationDbContext(DbContextOptions options)
            : base(options)
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
