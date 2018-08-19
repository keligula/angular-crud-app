using System;
using System.IO;
using System.Threading.Tasks;
using Cargo.Core.Models;
using Microsoft.AspNetCore.Http;

namespace Cargo.Core
{
    public class PhotoService : IPhotoService
    {
        private readonly IUnitOfWork uow;
        private readonly IPhotoStorage photoStorage;

        public PhotoService(IUnitOfWork uow, IPhotoStorage photoStorage)
        {
            this.uow = uow;
            this.photoStorage = photoStorage;
        }

        public async Task<Photo> UploadPhoto(Vehicle vehicle, IFormFile file, string uploadsFolderPath)
        {
            var fileName = await photoStorage.StorePhoto(uploadsFolderPath, file);
            var photo = new Photo { FileName = fileName };

            vehicle.Photos.Add(photo);
            await uow.CompleteAsync();

            return photo;
        }
    }

}