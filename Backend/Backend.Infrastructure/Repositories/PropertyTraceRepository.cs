using Backend.Domain.Entities;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Backend.Infrastructure.Repositories
{
    public class PropertyTraceRepository
    {
        private readonly IMongoCollection<PropertyTrace> _collection;

        public PropertyTraceRepository(IMongoClient client, IConfiguration config)
        {
            var db = client.GetDatabase(config["Mongo:Database"] ?? "RealEstateDb");
            _collection = db.GetCollection<PropertyTrace>(config["Mongo:Collections:PropertyTraces"] ?? "PropertyTraces");
        }

        public List<PropertyTrace> GetByProperty(string idProperty) => _collection.Find(x => x.IdProperty == idProperty).ToList();
    }
}
