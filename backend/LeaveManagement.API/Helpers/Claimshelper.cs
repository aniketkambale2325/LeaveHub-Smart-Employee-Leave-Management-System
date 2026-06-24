
using System.Security.Claims;

namespace LeaveManagement.API.Helpers;
public static class ClaimsHelper
{
    public static int GetUserId(ClaimsPrincipal user)
    {
        var claim = user.FindFirst("UserId")?.Value
                 ?? user.FindFirst("userId")?.Value;
        return int.TryParse(claim, out var id) ? id : 0;
    }

    public static string GetRole(ClaimsPrincipal user)
    {
        return user.FindFirst("Role")?.Value ?? string.Empty;
    }
}