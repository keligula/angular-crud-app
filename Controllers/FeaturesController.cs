using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Cargo.Controllers.Resources;
using Cargo.Core.Models;
using Cargo.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cargo.Controllers
{
    public class FeaturesController : Controller
    {
        private readonly CargoDbContext context;
        private readonly IMapper mapper;
        public FeaturesController(CargoDbContext context, IMapper mapper)
        {
            this.mapper = mapper;
            this.context = context;
        }

        [HttpGet("/api/features")]
        public async Task<IEnumerable<KeyValuePairResource>> GetFeatures()
        {
            var features = await context.Features.ToListAsync();

            return mapper.Map<List<Feature>, List<KeyValuePairResource>>(features);
        }
    }
}
