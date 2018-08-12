using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cargo.Core;
using Cargo.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Cargo.Persistence
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly CargoDbContext context;

        public PhotoRepository(CargoDbContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<Photo>> GetPhotos(int vehicleId)
        {
            return await context.Photos
                .Where(p => p.VehicleId == vehicleId)
                .ToListAsync();
        }
    }
}