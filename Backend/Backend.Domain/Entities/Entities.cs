using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Backend.Domain.Entities
{
    public class Property
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("idProperty")]
        public string IdProperty { get; set; } = null!;

        [BsonElement("Name")]
        public string Name { get; set; } = null!;

        [BsonElement("Address")]
        public string Address { get; set; } = null!;

        [BsonElement("Price")]
        public decimal Price { get; set; }

        [BsonElement("CodeInternal")]
        public string CodeInternal { get; set; } = null!;

        [BsonElement("Year")]
        public int Year { get; set; }

        [BsonElement("IdOwner")]
        public string IdOwner { get; set; } = null!;
    }

    public class Owner
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("idOwner")]
        public string IdOwner { get; set; } = null!;

        [BsonElement("Name")]
        public string Name { get; set; } = null!;

        [BsonElement("Address")]
        public string Address { get; set; } = null!;

        [BsonElement("Photo")]
        public string? Photo { get; set; }

        [BsonElement("Birthday")]
        public DateTime Birthday { get; set; }
    }

    public class PropertyImage
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("idPropertyImage")]
        public string IdPropertyImage { get; set; } = null!;

        [BsonElement("idProperty")]
        public string IdProperty { get; set; } = null!;

        [BsonElement("File")]
        public string File { get; set; } = null!;

        [BsonElement("Enabled")]
        public bool Enabled { get; set; }
    }

    public class PropertyTrace
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("idPropertyTrace")]
        public string IdPropertyTrace { get; set; } = null!;

        [BsonElement("DateSale")]
        public DateTime DateSale { get; set; }

        [BsonElement("Name")]
        public string Name { get; set; } = null!;

        [BsonElement("Value")]
        public decimal Value { get; set; }

        [BsonElement("Tax")]
        public decimal Tax { get; set; }

        [BsonElement("idProperty")]
        public string IdProperty { get; set; } = null!;
    }
}
