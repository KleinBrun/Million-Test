using Backend.Domain.Entities;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Backend.Infrastructure.Repositories
{
    public class PropertyImageRepository
    {
        private readonly IMongoCollection<PropertyImage> _collection;

        public PropertyImageRepository(IMongoClient client, IConfiguration config)
        {
            var db = client.GetDatabase(config["Mongo:Database"]);
            _collection = db.GetCollection<PropertyImage>(config["Mongo:Collections:PropertyImages"]);
        }

        public List<PropertyImage> GetByProperty(string idProperty) =>
            _collection.Find(x => x.IdProperty == idProperty && x.Enabled).ToList();
    }
}
