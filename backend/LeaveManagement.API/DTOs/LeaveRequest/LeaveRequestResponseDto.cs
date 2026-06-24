namespace LeaveManagement.API.DTOs.LeaveRequest;
public class LeaveRequestResponseDto
{
public int Id { get; set; }
public string EmployeeName { get; set; } = string.Empty;
public string LeaveTypeName { get; set; } = string.Empty;
public DateTime StartDate { get; set; }
public DateTime EndDate { get; set; }
public int TotalDays { get; set; }
public string Reason { get; set; } = string.Empty;
public string Status { get; set; } = string.Empty;
public string ManagerComment { get; set; }
public DateTime AppliedDate { get; set; }
public DateTime? ApprovedRejectedDate { get; set; }
public string ApprovedRejectedByName { get; set; }
}