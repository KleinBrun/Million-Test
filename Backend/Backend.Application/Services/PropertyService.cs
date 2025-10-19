using Backend.Application.Dtos;
using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Infrastructure.Repositories;

namespace Backend.Application.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly PropertyRepository _propertyRepo;
        private readonly OwnerRepository _ownerRepo;
        private readonly PropertyImageRepository _imageRepo;
        private readonly PropertyTraceRepository _traceRepo;

        public PropertyService(
            PropertyRepository propertyRepo,
            OwnerRepository ownerRepo,
            PropertyImageRepository imageRepo,
            PropertyTraceRepository traceRepo)
        {
            _propertyRepo = propertyRepo;
            _ownerRepo = ownerRepo;
            _imageRepo = imageRepo;
            _traceRepo = traceRepo;
        }

        public (List<PropertyFullDto> Data, long TotalCount) GetAllWithRelations(
            string? name, string? address, decimal? minPrice, decimal? maxPrice, int page, int pageSize)
        {
            var (props, total) = _propertyRepo.GetFiltered(name, address, minPrice, maxPrice, page, pageSize);

            var result = props.Select(p => new PropertyFullDto
            {
                IdProperty = p.IdProperty,
                Name = p.Name,
                Address = p.Address,
                Price = p.Price,
                CodeInternal = p.CodeInternal,
                Year = p.Year,
                Owner = ToOwnerDto(_ownerRepo.GetById(p.IdOwner)),
                Images = _imageRepo.GetByProperty(p.IdProperty).Select(ToImageDto).ToList(),
                Traces = _traceRepo.GetByProperty(p.IdProperty).Select(ToTraceDto).ToList()
            }).ToList();

            return (result, total);
        }

        public PropertyFullDto? GetById(string id)
        {
            var p = _propertyRepo.GetById(id);
            if (p == null) return null;

            return new PropertyFullDto
            {
                IdProperty = p.IdProperty,
                Name = p.Name,
                Address = p.Address,
                Price = p.Price,
                CodeInternal = p.CodeInternal,
                Year = p.Year,
                Owner = ToOwnerDto(_ownerRepo.GetById(p.IdOwner)),
                Images = _imageRepo.GetByProperty(p.IdProperty).Select(ToImageDto).ToList(),
                Traces = _traceRepo.GetByProperty(p.IdProperty).Select(ToTraceDto).ToList()
            };
        }

        private static OwnerDto? ToOwnerDto(Owner? o)
        {
            if (o == null) return null;
            return new OwnerDto
            {
                IdOwner = o.IdOwner,
                Name = o.Name,
                Address = o.Address,
                Photo = o.Photo,
                Birthday = o.Birthday
            };
        }

        private static PropertyImageDto ToImageDto(PropertyImage i) =>
            new PropertyImageDto
            {
                IdPropertyImage = i.IdPropertyImage,
                IdProperty = i.IdProperty,
                File = i.File,
                Enabled = i.Enabled
            };

        private static PropertyTraceDto ToTraceDto(PropertyTrace t) =>
            new PropertyTraceDto
            {
                IdPropertyTrace = t.IdPropertyTrace,
                IdProperty = t.IdProperty,
                Name = t.Name,
                DateSale = t.DateSale,
                Value = t.Value,
                Tax = t.Tax
            };
    }
}
