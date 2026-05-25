namespace backend.DTOs;

/// <summary>
/// returned by GET /api/contacts/{id}/whatsapp.
/// wraps the wa.me URL in an object
/// </summary>
public class WhatsAppLinkResponse
{
    public string Url { get; set; } = string.Empty;
}
