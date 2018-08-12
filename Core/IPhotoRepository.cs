using System.Collections.Generic;
using System.Threading.Tasks;
using Cargo.Core.Models;

namespace Cargo.Core
{
    public interface IPhotoRepository
    {
        Task<IEnumerable<Photo>> GetPhotos(int vehicleId);
    }
}