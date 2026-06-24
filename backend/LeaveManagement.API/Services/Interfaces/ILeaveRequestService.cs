using LeaveManagement.API.DTOs.LeaveRequest;

namespace LeaveManagement.API.Services.Interfaces;

public interface ILeaveRequestService
{
    Task<(bool Success, string Message)> ApplyAsync(int employeeId, ApplyLeaveDto dto);
    Task<List<LeaveRequestResponseDto>> GetMyLeavesAsync(int employeeId);
    Task<List<LeaveRequestResponseDto>> GetPendingForManagerAsync(int managerId);
    Task<List<LeaveRequestResponseDto>> GetTeamHistoryAsync(int managerId);
    Task<List<LeaveRequestResponseDto>> GetAllAsync();
    Task<(bool Success, string Message)> ApproveAsync(int requestId, int managerId, ApproveRejectDto dto);
    Task<(bool Success, string Message)> RejectAsync(int requestId, int managerId, ApproveRejectDto dto);
    Task<(bool Success, string Message)> CancelAsync(int requestId, int employeeId);
}