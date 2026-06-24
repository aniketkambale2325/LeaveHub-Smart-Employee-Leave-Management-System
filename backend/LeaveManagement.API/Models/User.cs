#nullable enable

namespace LeaveManagement.API.Models;

public class User
{
    public int Id {get; set;}
    public string FullName {get; set;} = string.Empty;
    public string? Email {get; set;}
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Employee"; // Admin | Manager | Employee
    public int DepartmentId {get; set;}
    public int? ManagerId { get; set; }   // Self-referential FK
    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;
    public bool IsActive {get; set;} = true;
    public Department? Department {get;set;}
    public User? Manager {get; set;}
    public ICollection<User> Subordinates { get; set; } = new List<User>();
    public ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();
    public ICollection<LeaveBalance> LeaveBalances { get; set; } = new List<LeaveBalance>();
}
