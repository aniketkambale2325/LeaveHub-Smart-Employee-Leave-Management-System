#nullable enable

namespace LeaveManagement.API.Models;

public class LeaveRequest
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public int LeaveTypeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TotalDays { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending | Approved | Rejected | Cancelled
    public string? ManagerComment { get; set; }
    public DateTime AppliedDate { get; set; } = DateTime.UtcNow;
    public DateTime? ApprovedRejectedDate { get; set; }
    public int? ApprovedRejectedBy { get; set; }

    // Navigation
    public User Employee { get; set; } = null!;
    public LeaveType LeaveType { get; set; } = null!;
    public User? ApprovedRejectedByUser { get; set; }
}