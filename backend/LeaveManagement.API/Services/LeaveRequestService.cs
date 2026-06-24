using LeaveManagement.API.Data;
using LeaveManagement.API.DTOs.LeaveRequest;
using LeaveManagement.API.Models;
using LeaveManagement.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.API.Services;

public class LeaveRequestService : ILeaveRequestService
{
    private readonly AppDbContext context;
    public LeaveRequestService(AppDbContext context) => this.context = context;

    public async Task<(bool Success, string Message)> ApplyAsync(int employeeId, ApplyLeaveDto dto)
    {
        // Rule 1: Cannot apply for past dates
        if (dto.StartDate.Date < DateTime.UtcNow.Date)
            return (false, "Start date cannot be in the past.");

        // Rule 2: End date cannot be before start date
        if (dto.EndDate.Date < dto.StartDate.Date)
            return (false, "End date cannot be before start date.");

        int totalDays = (int)(dto.EndDate.Date - dto.StartDate.Date).TotalDays + 1;

        // Rule 4: Check leave balance
        var balance = await context.LeaveBalances
            .FirstOrDefaultAsync(b => b.EmployeeId == employeeId && b.LeaveTypeId == dto.LeaveTypeId);

        if (balance == null)
            return (false, "Leave balance not found.");

        int remaining = balance.TotalLeaves - balance.UsedLeaves;
        if (remaining < totalDays)
            return (false, $"Insufficient leave balance. Available: {remaining}, Requested: {totalDays}");

        var request = new LeaveRequest
        {
            EmployeeId  = employeeId,
            LeaveTypeId = dto.LeaveTypeId,
            StartDate   = dto.StartDate,
            EndDate     = dto.EndDate,
            TotalDays   = totalDays,
            Reason      = dto.Reason,
            Status      = "Pending",
            AppliedDate = DateTime.UtcNow
        };

        context.LeaveRequests.Add(request);
        await context.SaveChangesAsync();
        return (true, "Leave applied successfully.");
    }

    public async Task<List<LeaveRequestResponseDto>> GetMyLeavesAsync(int employeeId)
    {
        return await context.LeaveRequests
            .Include(r => r.LeaveType)
            .Include(r => r.Employee)
            .Include(r => r.ApprovedRejectedByUser)
            .Where(r => r.EmployeeId == employeeId)
            .OrderByDescending(r => r.AppliedDate)
            .Select(r => MapToDto(r))
            .ToListAsync();
    }

    public async Task<List<LeaveRequestResponseDto>> GetPendingForManagerAsync(int managerId)
    {
        // Get IDs of employees assigned to this manager
        var subordinateIds = await context.Users
            .Where(u => u.ManagerId == managerId && u.IsActive)
            .Select(u => u.Id)
            .ToListAsync();

        return await context.LeaveRequests
            .Include(r => r.LeaveType)
            .Include(r => r.Employee)
            .Include(r => r.ApprovedRejectedByUser)
            .Where(r => subordinateIds.Contains(r.EmployeeId) && r.Status == "Pending")
            .OrderByDescending(r => r.AppliedDate)
            .Select(r => MapToDto(r))
            .ToListAsync();
    }

    public async Task<List<LeaveRequestResponseDto>> GetTeamHistoryAsync(int managerId)
    {
        var subordinateIds = await context.Users
            .Where(u => u.ManagerId == managerId && u.IsActive)
            .Select(u => u.Id)
            .ToListAsync();

        return await context.LeaveRequests
            .Include(r => r.LeaveType)
            .Include(r => r.Employee)
            .Include(r => r.ApprovedRejectedByUser)
            .Where(r => subordinateIds.Contains(r.EmployeeId))
            .OrderByDescending(r => r.AppliedDate)
            .Select(r => MapToDto(r))
            .ToListAsync();
    }

    public async Task<List<LeaveRequestResponseDto>> GetAllAsync()
    {
        return await context.LeaveRequests
            .Include(r => r.LeaveType)
            .Include(r => r.Employee)
            .Include(r => r.ApprovedRejectedByUser)
            .OrderByDescending(r => r.AppliedDate)
            .Select(r => MapToDto(r))
            .ToListAsync();
    }

    public async Task<(bool Success, string Message)> ApproveAsync(
        int requestId, int managerId, ApproveRejectDto dto)
    {
        var request = await context.LeaveRequests
            .Include(r => r.Employee)
            .FirstOrDefaultAsync(r => r.Id == requestId);

        if (request == null) return (false, "Request not found.");
        if (request.Status != "Pending") return (false, "Only pending requests can be approved.");

        // Rule 8: Manager can only approve their own subordinates
        if (request.Employee.ManagerId != managerId)
            return (false, "You are not authorized to approve this request.");

        // Rule 5: Deduct balance on approval
        var balance = await context.LeaveBalances
            .FirstOrDefaultAsync(b =>
                b.EmployeeId == request.EmployeeId &&
                b.LeaveTypeId == request.LeaveTypeId);

        if (balance != null)
            balance.UsedLeaves += request.TotalDays;

        request.Status                = "Approved";
        request.ManagerComment        = dto.ManagerComment;
        request.ApprovedRejectedDate  = DateTime.UtcNow;
        request.ApprovedRejectedBy    = managerId;

        await context.SaveChangesAsync();
        return (true, "Leave approved.");
    }

    public async Task<(bool Success, string Message)> RejectAsync(
        int requestId, int managerId, ApproveRejectDto dto)
    {
        var request = await context.LeaveRequests
            .Include(r => r.Employee)
            .FirstOrDefaultAsync(r => r.Id == requestId);

        if (request == null) return (false, "Request not found.");
        if (request.Status != "Pending") return (false, "Only pending requests can be rejected.");

        if (request.Employee.ManagerId != managerId)
            return (false, "You are not authorized to reject this request.");

        // Rule 6: Rejected leave does NOT affect balance
        request.Status               = "Rejected";
        request.ManagerComment       = dto.ManagerComment;
        request.ApprovedRejectedDate = DateTime.UtcNow;
        request.ApprovedRejectedBy   = managerId;

        await context.SaveChangesAsync();
        return (true, "Leave rejected.");
    }

    public async Task<(bool Success, string Message)> CancelAsync(int requestId, int employeeId)
    {
        var request = await context.LeaveRequests
            .FirstOrDefaultAsync(r => r.Id == requestId && r.EmployeeId == employeeId);

        if (request == null) return (false, "Request not found.");
        if (request.Status != "Pending") return (false, "Only pending requests can be cancelled.");

        // Rule 7: Cancelled leave does NOT affect balance
        request.Status = "Cancelled";
        await context.SaveChangesAsync();
        return (true, "Leave cancelled.");
    }

    private static LeaveRequestResponseDto MapToDto(LeaveRequest r) => new()
    {
        Id                     = r.Id,
        EmployeeName           = r.Employee.FullName,
        LeaveTypeName          = r.LeaveType.Name,
        StartDate              = r.StartDate,
        EndDate                = r.EndDate,
        TotalDays              = r.TotalDays,
        Reason                 = r.Reason,
        Status                 = r.Status,
        ManagerComment         = r.ManagerComment,
        AppliedDate            = r.AppliedDate,
        ApprovedRejectedDate   = r.ApprovedRejectedDate,
        ApprovedRejectedByName = r.ApprovedRejectedByUser?.FullName
    };
}