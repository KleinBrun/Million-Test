using Backend.Application.Dtos;
using Backend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Backend.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _service;

        public PropertiesController(IPropertyService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<List<PropertyDto>> Get(string? name, string? address, double? minPrice, double? maxPrice)
        {
            var properties = _service.GetProperties(name, address, minPrice, maxPrice);
            return Ok(properties);
        }
    }
}
