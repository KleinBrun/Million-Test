
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

RUN mkdir -p Backend.API Backend.Application Backend.Domain Backend.Infrastructure Backend.Tests

COPY ./Backend/Backend.API/*.csproj ./Backend.API/
COPY ./Backend/Backend.Application/*.csproj ./Backend.Application/
COPY ./Backend/Backend.Domain/*.csproj ./Backend.Domain/
COPY ./Backend/Backend.Infrastructure/*.csproj ./Backend.Infrastructure/


RUN dotnet restore ./Backend.API/Backend.API.csproj


COPY ./Backend/. .


RUN dotnet publish ./Backend.API/Backend.API.csproj -c Release -o /app/publish


FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .  
COPY --from=build /app/publish .  
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Backend.API.dll"]
