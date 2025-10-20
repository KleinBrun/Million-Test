using Backend.Application.Interfaces;
using Backend.Application.Services;
using Backend.Infrastructure.Repositories;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Backend API", Version = "v1" });
});

builder.Services.AddControllers();

builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var cfg = sp.GetRequiredService<IConfiguration>();
    var cs = cfg.GetConnectionString("Mongo") ?? cfg["Mongo:ConnectionString"] ?? "mongodb://localhost:27017";
    return new MongoClient(cs);
});

builder.Services.AddCors(o =>
{
    o.AddPolicy("AllowFrontend", p => p
        .WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

builder.Services.AddSingleton<PropertyRepository>();
builder.Services.AddSingleton<OwnerRepository>();
builder.Services.AddSingleton<PropertyImageRepository>();
builder.Services.AddSingleton<PropertyTraceRepository>();
builder.Services.AddScoped<IPropertyService, PropertyService>();

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Backend API v1");
    c.RoutePrefix = string.Empty;
});

app.MapGet("/ping", () => Results.Ok(new { ok = true, time = DateTime.UtcNow }));

app.MapControllers();

Console.WriteLine("App escuchando en: " + string.Join(", ", app.Urls));
app.Run();

public partial class Program { }