using backend.DTOs;
using backend.Models;
using backend.Repositories;
using backend.Services;
using backend.Utilities;

namespace backend.Services;

/// <summary>
/// Service that encapsulates logic rules for the Contact domain.
/// </summary>
public class ContactService : IContactService
{
    private readonly IContactRepository _repository;

    public ContactService(IContactRepository repository)
    {
        _repository = repository;
    }

    /// <summary>
    /// Returns all contacts mapped to response DTOs.
    /// </summary>
    public async Task<IEnumerable<ContactResponse>> GetAllAsync()
    {
        IEnumerable<Contact> contacts = await _repository.GetAllAsync();
        return contacts.Select(ToResponse);
    }

    /// <summary>
    /// Returns a single contact by Id, or null when not found.
    /// </summary>
    public async Task<ContactResponse?> GetByIdAsync(int id)
    {
        Contact? contact = await _repository.GetByIdAsync(id);
        return contact is null ? null : ToResponse(contact);
    }

    /// <summary>
    /// Creates a new contact after normalizing the phone number.
    /// Throws ArgumentException when the phone is invalid (caught by the controller).
    /// </summary>
    public async Task<ContactResponse> CreateAsync(ContactRequest request)
    {
        string normalizedPhone = NormalizePhoneOrThrow(request.Phone);

        Contact contact = new()
        {
            Name = request.Name.Trim(),
            Phone = normalizedPhone
        };

        Contact created = await _repository.AddAsync(contact);
        return ToResponse(created);
    }

    /// <summary>
    /// Updates an existing contact. Returns null when not found.
    /// Throws ArgumentException when the phone is invalid.
    /// </summary>
    public async Task<ContactResponse?> UpdateAsync(int id, ContactRequest request)
    {
        Contact? existing = await _repository.GetByIdAsync(id);
        if (existing is null)
        {
            return null;
        }

        string normalizedPhone = NormalizePhoneOrThrow(request.Phone);

        existing.Name = request.Name.Trim();
        existing.Phone = normalizedPhone;

        await _repository.UpdateAsync(existing);
        return ToResponse(existing);
    }

    /// <summary>
    /// Deletes a contact. Returns false when not found.
    /// </summary>
    public async Task<bool> DeleteAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }

    /// <summary>
    /// Builds the wa.me link for a contact. Returns null when the contact is not found.
    /// </summary>
    public async Task<WhatsAppLinkResponse?> GetWhatsAppLinkAsync(int id)
    {
        Contact? contact = await _repository.GetByIdAsync(id);
        if (contact is null)
        {
            return null;
        }

        return new WhatsAppLinkResponse
        {
            Url = PhoneHelper.BuildWhatsAppLink(contact.Phone)
        };
    }

    /// <summary>
    /// Normalizes the phone number through PhoneHelper.
    /// </summary>
    private static string NormalizePhoneOrThrow(string phone)
    {
        if (!PhoneHelper.TryNormalize(phone, out string normalized, out string error))
        {
            throw new ArgumentException(error, nameof(ContactRequest.Phone));
        }

        return normalized;
    }

    /// <summary>
    /// Maps a Contact entity to a ContactResponse DTO.
    /// </summary>
    private static ContactResponse ToResponse(Contact contact)
    {
        return new ContactResponse
        {
            Id = contact.Id,
            Name = contact.Name,
            Phone = contact.Phone
        };
    }
}