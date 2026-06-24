namespace LeaveManagement.API.Models;

public class LeaveBalance
{
    public int Id {get; set;}
    public int EmployeeId {get; set;}
    public int LeaveTypeId {get; set;}
    public int TotalLeaves {get; set;}
    public int UsedLeaves {get; set;}
    public int RemainingLeaves => TotalLeaves - UsedLeaves;  // Computed

    // Navigation
    public User Employee { get; set; } = null!;
    public LeaveType LeaveType { get; set; } = null!;
}