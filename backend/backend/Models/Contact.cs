namespace backend.Models;

/// <summary>
/// Domain entity that represents a contact persisted in the database.
/// Mapped to the "Contacts" table.
/// </summary>
public class Contact
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}
