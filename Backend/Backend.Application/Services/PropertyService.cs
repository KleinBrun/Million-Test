using Backend.Application.Dtos;
using Backend.Application.Interfaces;
using Backend.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Application.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly PropertyRepository _repository;

        public PropertyService(PropertyRepository repository)
        {
            _repository = repository;
        }

        public List<PropertyDto> GetProperties(string? name, string? address, double? minPrice, double? maxPrice)
{
            var properties = _repository.GetAllProperties();

            if (!string.IsNullOrEmpty(name))
                properties = properties.Where(p => p.Name.Contains(name, StringComparison.OrdinalIgnoreCase)).ToList();

            if (!string.IsNullOrEmpty(address))
                properties = properties.Where(p => p.Address.Contains(address, StringComparison.OrdinalIgnoreCase)).ToList();

            if (minPrice.HasValue)
                properties = properties.Where(p => (double)p.Price >= minPrice.Value).ToList();

            if (maxPrice.HasValue)
                properties = properties.Where(p => (double)p.Price <= maxPrice.Value).ToList();

            return properties.Select(p => new PropertyDto
            {
                Id = p.Id ?? "",
                Name = p.Name ?? "",
                Address = p.Address ?? "",
                Price = (double)p.Price,
                Image = p.Image ?? ""
            }).ToList();
        }
    }
}
