using System.Net.Http.Json;
using System.Text.Json;
using Backend.API;
using Backend.Application.Dtos;
using Backend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;

namespace Backend.Tests;

file class FakePropertyService : IPropertyService
{
    public (List<PropertyFullDto> Data, long TotalCount) GetAllWithRelations(string? name, string? address, decimal? minPrice, decimal? maxPrice, int page, int pageSize)
    {
        return (new List<PropertyFullDto>
        {
            new PropertyFullDto
            {
                IdProperty = "test-1",
                Name = "Test Property",
                Address = "Test Address",
                Price = 1000,
                CodeInternal = "CODE",
                Year = 2020,
                Owner = null,
                Images = new(),
                Traces = new()
            }
        }, 1);
    }

    public PropertyFullDto? GetById(string id)
    {
        if (id == "missing") return null;
        return new PropertyFullDto
        {
            IdProperty = id,
            Name = "ById Property",
            Address = "ById Address",
            Price = 2000,
            CodeInternal = "CODE2",
            Year = 2021,
            Owner = null,
            Images = new(),
            Traces = new()
        };
    }
}

[TestFixture]
public class ApiTests
{
    private WebApplicationFactory<Program> _factory = null!;

    [SetUp]
    public void SetUp()
    {
        _factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IPropertyService));
                    if (descriptor != null)
                    {
                        services.Remove(descriptor);
                    }
                    services.AddSingleton<IPropertyService, FakePropertyService>();
                });
            });
    }

    [TearDown]
    public void TearDown()
    {
        _factory?.Dispose();
    }

    [Test]
    public async Task Ping_ReturnsOk()
    {
        var client = _factory.CreateClient();
        var res = await client.GetAsync("/ping");
        Assert.That(res.IsSuccessStatusCode, Is.True);
        var payload = await res.Content.ReadFromJsonAsync<dynamic>();
        Assert.That(payload, Is.Not.Null);
    }

    [Test]
    public async Task Get_Properties_ReturnsPagedData()
    {
        var client = _factory.CreateClient();
        var res = await client.GetAsync("/api/property?page=1&pageSize=5");
        Assert.That(res.IsSuccessStatusCode, Is.True);
        var json = await res.Content.ReadFromJsonAsync<JsonElement>();
        Assert.That(json.TryGetProperty("totalCount", out _), Is.True);
        Assert.That(json.TryGetProperty("data", out var data), Is.True);
        Assert.That(data.ValueKind, Is.EqualTo(JsonValueKind.Array));
    }

    [Test]
    public async Task Get_Property_ById_ReturnsNotFound_ForMissing()
    {
        var client = _factory.CreateClient();
        var res = await client.GetAsync("/api/property/missing");
        Assert.That((int)res.StatusCode, Is.EqualTo(404));
    }

    [Test]
    public async Task Get_Property_ById_ReturnsOk()
    {
        var client = _factory.CreateClient();
        var res = await client.GetAsync("/api/property/ok-id");
        Assert.That(res.IsSuccessStatusCode, Is.True);
        var dto = await res.Content.ReadFromJsonAsync<PropertyFullDto>();
        Assert.That(dto, Is.Not.Null);
        Assert.That(dto!.IdProperty, Is.EqualTo("ok-id"));
    }
}
