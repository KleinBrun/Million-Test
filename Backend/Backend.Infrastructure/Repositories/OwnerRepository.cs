using Backend.Domain.Entities;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Backend.Infrastructure.Repositories
{
    public class OwnerRepository
    {
        private readonly IMongoCollection<Owner> _collection;

        public OwnerRepository(IMongoClient client, IConfiguration config)
        {
            var db = client.GetDatabase(config["Mongo:Database"]);
            _collection = db.GetCollection<Owner>(config["Mongo:Collections:Owners"]);
        }

        public Owner? GetById(string id) => _collection.Find(x => x.IdOwner == id).FirstOrDefault();
    }

}
