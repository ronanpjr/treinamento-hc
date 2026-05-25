using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;


/// <summary>
/// used by POST and PUT endpoints when creating or updating a contact.
/// </summary>
public class ContactRequest
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone is required.")]
    public string Phone { get; set; } = string.Empty;
}