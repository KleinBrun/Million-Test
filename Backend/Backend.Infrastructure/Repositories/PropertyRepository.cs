using Backend.Domain.Entities;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Backend.Infrastructure.Repositories;

public class PropertyRepository
{
    private readonly IMongoCollection<Property> _properties;

    public PropertyRepository(IConfiguration config)
    {
        var client = new MongoClient(config["MongoDbSettings:ConnectionString"]);
        var db = client.GetDatabase(config["MongoDbSettings:DatabaseName"]);
        _properties = db.GetCollection<Property>(config["MongoDbSettings:PropertiesCollectionName"]);
    }

    public List<Property> GetAllProperties() => _properties.Find(p => true).ToList();
}
