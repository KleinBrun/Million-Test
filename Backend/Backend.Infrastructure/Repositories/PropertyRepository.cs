using Backend.Domain.Entities;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Infrastructure.Repositories
{
    public class PropertyRepository
    {
        private readonly IMongoCollection<Property> _collection;

        public PropertyRepository(IMongoClient client, IConfiguration config)
        {
            var db = client.GetDatabase(config["Mongo:Database"] ?? "RealEstateDb");
            _collection = db.GetCollection<Property>(config["Mongo:Collections:Properties"] ?? "Properties");
        }

        public (List<Property> Items, long TotalCount) GetFiltered(
            string? name, string? address, decimal? minPrice, decimal? maxPrice, int page, int pageSize)
        {
            var builder = Builders<Property>.Filter;
            var filter = builder.Empty;

            if (!string.IsNullOrEmpty(name))
                filter &= builder.Regex("Name", new BsonRegularExpression(name, "i"));

            if (!string.IsNullOrEmpty(address))
                filter &= builder.Regex("Address", new BsonRegularExpression(address, "i"));

            if (minPrice.HasValue)
                filter &= builder.Gte("Price", minPrice.Value);

            if (maxPrice.HasValue)
                filter &= builder.Lte("Price", maxPrice.Value);

            var total = _collection.CountDocuments(filter);

            var items = _collection.Find(filter)
                                   .Skip((page - 1) * pageSize)
                                   .Limit(pageSize)
                                   .ToList();

            return (items, total);
        }

        public Property? GetById(string id)
        {
            if (!ObjectId.TryParse(id, out var objectId)) return null;
            var filter = Builders<Property>.Filter.Eq("_id", objectId);
            return _collection.Find(filter).FirstOrDefault();
        }

        public Property Insert(Property property)
        {
            _collection.InsertOne(property);
            return property;
        }
    }
}
