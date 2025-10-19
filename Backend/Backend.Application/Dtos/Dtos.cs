using System;
using System.Collections.Generic;

namespace Backend.Application.Dtos
{
    public class PropertyFullDto
    {
        public string IdProperty { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public decimal Price { get; set; }
        public string CodeInternal { get; set; } = null!;
        public int Year { get; set; }

        public OwnerDto? Owner { get; set; }
        public List<PropertyImageDto>? Images { get; set; }
        public List<PropertyTraceDto>? Traces { get; set; }
    }

    public class OwnerDto
    {
        public string IdOwner { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string? Photo { get; set; }
        public DateTime Birthday { get; set; }
    }

    public class PropertyImageDto
    {
        public string IdPropertyImage { get; set; } = null!;
        public string IdProperty { get; set; } = null!;
        public string File { get; set; } = null!;
        public bool Enabled { get; set; }
    }

    public class PropertyTraceDto
    {
        public string IdPropertyTrace { get; set; } = null!;
        public DateTime DateSale { get; set; }
        public string Name { get; set; } = null!;
        public decimal Value { get; set; }
        public decimal Tax { get; set; }
        public string IdProperty { get; set; } = null!;
    }
}
