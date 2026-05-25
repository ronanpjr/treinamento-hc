# HC API

REST API for managing phonebook contacts, built with ASP.NET Core and PostgreSQL.

## Tech Stack

- **Runtime:** .NET 8
- **Framework:** ASP.NET Core Web API
- **ORM:** Entity Framework Core with Npgsql provider
- **Database:** PostgreSQL 16
- **Documentation:** Swagger / OpenAPI

## Running with Docker Compose

The recommended way to run the full project (frontend + backend + database):

```bash
docker compose up --build
```

- API Swagger UI: `http://localhost:8081/swagger`
- Frontend: `http://localhost:4200`

## Running locally (Visual Studio)

1. Start the database container:

```bash
docker compose up -d db
```

2. Open `backend.sln` in Visual Studio and press `F5`.

The API will start and open Swagger automatically.

> The connection string is configured in `appsettings.Development.json`.

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/contacts | List all contacts |
| GET | /api/contacts/{id} | Get contact by Id |
| POST | /api/contacts | Create a new contact |
| PUT | /api/contacts/{id} | Update a contact |
| DELETE | /api/contacts/{id} | Delete a contact |
| GET | /api/contacts/{id}/whatsapp | Get wa.me link for a contact |

## Phone Number Format

Phone numbers are normalized before being stored: digits only, including country code.

Example: `(11) 9 8765-4321` is stored as `5511987654321`.
