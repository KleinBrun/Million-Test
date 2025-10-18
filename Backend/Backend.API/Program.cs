using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Backend.Application.Interfaces;
using Backend.Application.Services;
using Backend.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);


// Registrar repositorio
builder.Services.AddSingleton<PropertyRepository>();
builder.Services.AddSingleton<IPropertyService, PropertyService>();

// Servicios
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Backend API",
        Version = "v1",
        Description = "API de prueba para propiedades"
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") 
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend");
// Middleware Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Backend API v1");
    c.RoutePrefix = string.Empty; // abre Swagger en http://localhost:5228/
});

// HTTPS deshabilitado en desarrollo
// app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();
app.Run();
