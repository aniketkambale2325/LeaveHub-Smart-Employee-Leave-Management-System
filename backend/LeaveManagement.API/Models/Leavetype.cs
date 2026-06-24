namespace LeaveManagement.API.Models;

public class LeaveType
{
    public int Id{get; set;}
    public string Name { get; set; } = string.Empty;       // Sick, Casual, Paid...
    public string Description {get; set;}
    public int DefaultDays {get; set;}
     public ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();
    public ICollection<LeaveBalance> LeaveBalances { get; set; } = new List<LeaveBalance>();

}