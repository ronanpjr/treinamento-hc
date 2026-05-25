using backend.Models;
namespace backend.Repositories;

/// <summary>
/// Repository contract for Contact data access.
/// </summary>
public interface IContactRepository
{
    Task<IEnumerable<Contact>> GetAllAsync();
    Task<Contact?> GetByIdAsync(int id);
    Task<Contact> AddAsync(Contact contact);
    Task UpdateAsync(Contact contact);
    Task<bool> DeleteAsync(int id);
}
