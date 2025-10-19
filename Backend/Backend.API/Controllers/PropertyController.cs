using Backend.Application.Dtos;
using Backend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyController : ControllerBase
    {
        private readonly IPropertyService _service;

        public PropertyController(IPropertyService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult Get(
            string? name,
            string? address,
            decimal? minPrice,
            decimal? maxPrice,
            int page = 1,
            int pageSize = 10)
        {
            var (properties, totalCount) = _service.GetAllWithRelations(name, address, minPrice, maxPrice, page, pageSize);

            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            return Ok(new
            {
                totalCount,
                page,
                pageSize,
                totalPages,
                data = properties
            });
        }

        [HttpGet("{id}")]
        public ActionResult<PropertyFullDto> GetById(string id)
        {
            var property = _service.GetById(id);
            if (property == null)
                return NotFound();

            return Ok(property);
        }
    }
}
