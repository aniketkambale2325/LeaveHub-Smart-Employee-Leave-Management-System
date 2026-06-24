namespace LeaveManagement.API.Models;

public class Department
{
    public int Id { get; set; }

    public string DepartmentName { get; set; } = string.Empty;

    public ICollection<User> Users { get; set; } = new List<User>();
}