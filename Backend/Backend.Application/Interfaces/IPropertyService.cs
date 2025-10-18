using Backend.Application.Dtos;
using System.Collections.Generic;

namespace Backend.Application.Interfaces
{
    public interface IPropertyService
    {
        List<PropertyDto> GetProperties(string? name, string? address, double? minPrice, double? maxPrice);
    }
}