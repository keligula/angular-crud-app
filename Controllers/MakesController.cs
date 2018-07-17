using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Cargo.Controllers.Resources;
using Cargo.Core.Models;
using Cargo.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cargo.Controllers
{
    public class MakesController : Controller
    {
        private readonly CargoDbContext context;
        private readonly IMapper mapper;
        public MakesController(CargoDbContext context, IMapper mapper)
        {
            this.mapper = mapper;
            this.context = context;
        }

        [HttpGet("/api/makes")]
        public async Task<IEnumerable<MakeResource>> GetMakes()
        {
            var makes = await context.Makes.Include(m => m.Models).ToListAsync();

            return mapper.Map<List<Make>, List<MakeResource>>(makes);
        }
    }
}