using System.Text.RegularExpressions;

namespace backend.Utilities;

public static class PhoneHelper
{
    private const string BrazilCountryCode = "55";
    private const int MinLengthWithLandline = 12;
    private const int MaxLengthWithMobile = 13;
    private const string WhatsAppBaseUrl = "https://wa.me/";

    public static bool TryNormalize(string? input, out string normalized, out string errorMessage)
    {
        normalized = string.Empty;
        errorMessage = string.Empty;

        if (string.IsNullOrWhiteSpace(input))
        {
            errorMessage = "Phone is required.";
            return false;
        }

        string digitsOnly = Regex.Replace(input, @"\D", "");

        if (!digitsOnly.StartsWith(BrazilCountryCode))
        {
            errorMessage = "Phone must include country code 55 (Brazil).";
            return false;
        }

        if (digitsOnly.Length < MinLengthWithLandline || digitsOnly.Length > MaxLengthWithMobile)
        {
            errorMessage = "Phone must have 12 digits (landline) or 13 digits (mobile) including country code.";
            return false;
        }

        normalized = digitsOnly;
        return true;
    }

    public static string BuildWhatsAppLink(string normalizedPhone)
    {
        return $"{WhatsAppBaseUrl}{normalizedPhone}";
    }
}