using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Allow the frontend dev server to call this API (CORS for development)
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevFrontend", policy =>
    {
        policy.WithOrigins("http://127.0.0.1:4200", "http://localhost:4200", "http://localhost:8080")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

using (IServiceScope scope = app.Services.CreateScope())
{
    AppDbContext dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS policy for development frontends
app.UseCors("DevFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();