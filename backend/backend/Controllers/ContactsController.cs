// File: Controllers/ContactsController.cs
// Status: NEW FILE

using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ContactsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContactResponse>>> GetAll()
    {
        List<Contact> contacts = await _context.Contacts
            .OrderBy(c => c.Name)
            .ToListAsync();

        IEnumerable<ContactResponse> response = contacts.Select(ToResponse);
        return Ok(response);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ContactResponse>> GetById(int id)
    {
        Contact? contact = await _context.Contacts.FindAsync(id);

        if (contact is null)
        {
            return NotFound();
        }

        return Ok(ToResponse(contact));
    }

    [HttpPost]
    public async Task<ActionResult<ContactResponse>> Create([FromBody] ContactRequest request)
    {
        if (!PhoneHelper.TryNormalize(request.Phone, out string normalizedPhone, out string phoneError))
        {
            ModelState.AddModelError(nameof(request.Phone), phoneError);
            return ValidationProblem(ModelState);
        }

        Contact contact = new()
        {
            Name = request.Name.Trim(),
            Phone = normalizedPhone
        };

        _context.Contacts.Add(contact);
        await _context.SaveChangesAsync();

        ContactResponse response = ToResponse(contact);
        return CreatedAtAction(nameof(GetById), new { id = contact.Id }, response);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ContactRequest request)
    {
        Contact? contact = await _context.Contacts.FindAsync(id);

        if (contact is null)
        {
            return NotFound();
        }

        if (!PhoneHelper.TryNormalize(request.Phone, out string normalizedPhone, out string phoneError))
        {
            ModelState.AddModelError(nameof(request.Phone), phoneError);
            return ValidationProblem(ModelState);
        }

        contact.Name = request.Name.Trim();
        contact.Phone = normalizedPhone;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        Contact? contact = await _context.Contacts.FindAsync(id);

        if (contact is null)
        {
            return NotFound();
        }

        _context.Contacts.Remove(contact);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id:int}/whatsapp")]
    public async Task<ActionResult<WhatsAppLinkResponse>> GetWhatsAppLink(int id)
    {
        Contact? contact = await _context.Contacts.FindAsync(id);

        if (contact is null)
        {
            return NotFound();
        }

        WhatsAppLinkResponse response = new()
        {
            Url = PhoneHelper.BuildWhatsAppLink(contact.Phone)
        };

        return Ok(response);
    }
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