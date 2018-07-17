using System.Threading.Tasks;
using Cargo.Core;

namespace Cargo.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly CargoDbContext context;
        public UnitOfWork(CargoDbContext context)
        {
            this.context = context;

        }

        public async Task CompleteAsync()
        {
            await context.SaveChangesAsync();
        }
    }
}