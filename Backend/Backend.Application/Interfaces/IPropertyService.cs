using Backend.Application.Dtos;

namespace Backend.Application.Interfaces
{
    public interface IPropertyService
    {
        (List<PropertyFullDto> Data, long TotalCount) GetAllWithRelations(string? name, string? address, decimal? minPrice, decimal? maxPrice, int page, int pageSize);
        PropertyFullDto? GetById(string id);
    }
}


