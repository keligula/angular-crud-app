using System.Threading.Tasks;
using Cargo.Core.Models;
using Microsoft.AspNetCore.Http;

namespace Cargo.Core
{
    public interface IPhotoService
    {
        Task<Photo> UploadPhoto(Vehicle vehicle, IFormFile file, string uploadsFolderPath);
    }
}