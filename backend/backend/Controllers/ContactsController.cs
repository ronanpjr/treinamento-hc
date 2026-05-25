using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

/// <summary>
/// REST endpoints for managing contacts.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ContactsController : ControllerBase
{
    private readonly IContactService _service;

    public ContactsController(IContactService service)
    {
        _service = service;
    }

    /// <summary>
    /// Returns all contacts ordered by name.
    /// </summary>
    /// <response code="200">Returns the list of contacts (may be empty).</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ContactResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ContactResponse>>> GetAll()
    {
        IEnumerable<ContactResponse> contacts = await _service.GetAllAsync();
        return Ok(contacts);
    }

    /// <summary>
    /// Returns a single contact by its Id.
    /// </summary>
    /// <param name="id">The contact Id.</param>
    /// <response code="200">Contact found.</response>
    /// <response code="404">Contact not found.</response>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ContactResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ContactResponse>> GetById(int id)
    {
        ContactResponse? contact = await _service.GetByIdAsync(id);

        if (contact is null)
        {
            return NotFound();
        }

        return Ok(contact);
    }

    /// <summary>
    /// Creates a new contact. The phone number is normalized to the international
    /// format (digits only, including country code).
    /// </summary>
    /// <param name="request">Contact data: name and phone.</param>
    /// <response code="201">Contact created.</response>
    /// <response code="400">Validation failed (missing fields or invalid phone format).</response>
    [HttpPost]
    [ProducesResponseType(typeof(ContactResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ContactResponse>> Create([FromBody] ContactRequest request)
    {
        try
        {
            ContactResponse created = await _service.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            ModelState.AddModelError(ex.ParamName ?? string.Empty, ex.Message);
            return ValidationProblem(ModelState);
        }
    }

    /// <summary>
    /// Updates an existing contact.
    /// </summary>
    /// <param name="id">The contact Id.</param>
    /// <param name="request">Updated contact data.</param>
    /// <response code="204">Contact updated.</response>
    /// <response code="400">Validation failed.</response>
    /// <response code="404">Contact not found.</response>
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] ContactRequest request)
    {
        try
        {
            ContactResponse? updated = await _service.UpdateAsync(id, request);

            if (updated is null)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            ModelState.AddModelError(ex.ParamName ?? string.Empty, ex.Message);
            return ValidationProblem(ModelState);
        }
    }

    /// <summary>
    /// Deletes a contact by Id.
    /// </summary>
    /// <param name="id">The contact Id.</param>
    /// <response code="204">Contact deleted.</response>
    /// <response code="404">Contact not found.</response>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        bool deleted = await _service.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    /// <summary>
    /// Builds the wa.me link for a contact using the stored normalized phone.
    /// </summary>
    /// <param name="id">The contact Id.</param>
    /// <response code="200">Returns an object with the wa.me URL.</response>
    /// <response code="404">Contact not found.</response>
    [HttpGet("{id:int}/whatsapp")]
    [ProducesResponseType(typeof(WhatsAppLinkResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<WhatsAppLinkResponse>> GetWhatsAppLink(int id)
    {
        WhatsAppLinkResponse? response = await _service.GetWhatsAppLinkAsync(id);

        if (response is null)
        {
            return NotFound();
        }

        return Ok(response);
    }
}