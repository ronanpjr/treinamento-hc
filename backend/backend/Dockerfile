# --------------- STAGE 1: BUILD ---------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia apenas o .csproj primeiro para aproveitar cache do Docker
COPY ["backend/backend.csproj", "backend/"]
RUN dotnet restore "backend/backend.csproj"

# Copia o restante do codigo e compila
COPY . .
WORKDIR "/src/backend"
RUN dotnet publish -c Release -o /app/publish

# --------------- STAGE 2: RUNTIME ---------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app

# Copia apenas os artefatos de build - nao o SDK
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "backend.dll"]