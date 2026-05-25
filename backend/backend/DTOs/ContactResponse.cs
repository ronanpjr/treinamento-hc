namespace backend.DTOs;

/// <summary>
/// returned by the contact endpoints (GET, POST, PUT).
/// Mirrors the Contact entity
/// </summary>
public class ContactResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}