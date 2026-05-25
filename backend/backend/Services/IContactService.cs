using backend.DTOs;

namespace backend.Services;

/// <summary>
/// Service contract for Contact business logic.
/// Principle: Interface Segregation. Each operation maps to a specific use case
/// of the API, keeping the contract focused.
/// </summary>
public interface IContactService
{
    Task<IEnumerable<ContactResponse>> GetAllAsync();
    Task<ContactResponse?> GetByIdAsync(int id);
    Task<ContactResponse> CreateAsync(ContactRequest request);
    Task<ContactResponse?> UpdateAsync(int id, ContactRequest request);
    Task<bool> DeleteAsync(int id);
    Task<WhatsAppLinkResponse?> GetWhatsAppLinkAsync(int id);
}