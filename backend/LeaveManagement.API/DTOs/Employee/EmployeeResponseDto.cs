#nullable enable

namespace LeaveManagement.API.DTOs.Employee;

public class EmployeeResponseDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public string? ManagerName { get; set; }
    public int? ManagerId { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }

}