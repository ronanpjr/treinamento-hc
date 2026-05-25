using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

/// <summary>
/// using Entity Framework Core.
/// Data access and persistence. no business rules.
/// </summary>
public class ContactRepository : IContactRepository
{
    private readonly AppDbContext _context;

    public ContactRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Returns all contacts ordered by name.
    /// </summary>
    public async Task<IEnumerable<Contact>> GetAllAsync()
    {
        return await _context.Contacts
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    /// <summary>
    /// Returns a single contact by its primary key, or null when not found.
    /// </summary>
    public async Task<Contact?> GetByIdAsync(int id)
    {
        return await _context.Contacts.FindAsync(id);
    }

    /// <summary>
    /// Persists a new contact.
    /// </summary>
    public async Task<Contact> AddAsync(Contact contact)
    {
        _context.Contacts.Add(contact);
        await _context.SaveChangesAsync();
        return contact;
    }

    /// <summary>
    /// persists changes to a contact already tracked by the DbContext.
    /// </summary>
    public async Task UpdateAsync(Contact contact)
    {
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Deletes a contact by Id. Returns false when the contact does not exist.
    /// </summary>
    public async Task<bool> DeleteAsync(int id)
    {
        Contact? contact = await _context.Contacts.FindAsync(id);

        if (contact is null)
        {
            return false;
        }

        _context.Contacts.Remove(contact);
        await _context.SaveChangesAsync();
        return true;
    }
}