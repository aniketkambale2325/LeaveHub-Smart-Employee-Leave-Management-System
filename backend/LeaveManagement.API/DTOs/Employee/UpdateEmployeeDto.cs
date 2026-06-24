
namespace LeaveManagement.API.DTOs.Employee;

public class UpdateEmployeeDto
{
    public string FullName {get; set;} = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int? DepartmentId { get; set; }
    public int? ManagerId { get; set; }
    public bool IsActive { get; set; } = true;

}