using System.ComponentModel.DataAnnotations;
namespace LeaveManagement.API.DTOs.LeaveRequest;
public class ApplyLeaveDto
{
[Required] public int LeaveTypeId { get; set; }
[Required] public DateTime StartDate { get; set; }
[Required] public DateTime EndDate { get; set; }
[Required] public string Reason { get; set; } = string.Empty;
}