using Backend.Application.Services;
using Backend.Infrastructure.Repositories;
using NUnit.Framework;
using Microsoft.Extensions.Configuration;

namespace Backend.Tests;

[TestFixture]
public class PropertyServiceTests
{
    private PropertyService _service = null!;

    [SetUp]
    public void Setup()
    {
        var repo = new PropertyRepository(new ConfigurationBuilder().AddJsonFile("appsettings.json").Build());
        _service = new PropertyService(repo);
    }

    [Test]
    public void GetProperties_ReturnsProperties()
    {
        var result = _service.GetProperties(null, null, null, null);
        Assert.That(result, Is.Not.Null); 
    }
}
