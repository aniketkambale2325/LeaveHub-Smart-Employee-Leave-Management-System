using LeaveManagement.API.Data;
using LeaveManagement.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.API.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext context;
    public DashboardController(AppDbContext context) => this.context = context;

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AdminDashboard()
    {
        var result = new
        {
            TotalEmployees  = await context.Users.CountAsync(u => u.Role == "Employee" && u.IsActive),
            TotalManagers   = await context.Users.CountAsync(u => u.Role == "Manager"  && u.IsActive),
            TotalRequests   = await context.LeaveRequests.CountAsync(),
            PendingRequests = await context.LeaveRequests.CountAsync(r => r.Status == "Pending"),
            Approved        = await context.LeaveRequests.CountAsync(r => r.Status == "Approved"),
            Rejected        = await context.LeaveRequests.CountAsync(r => r.Status == "Rejected")
        };
        return Ok(result);
    }

    [HttpGet("manager")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> ManagerDashboard()
    {
        var managerId = ClaimsHelper.GetUserId(User);
        var teamIds = await context.Users
            .Where(u => u.ManagerId == managerId && u.IsActive)
            .Select(u => u.Id)
            .ToListAsync();

        var result = new
        {
            TeamCount       = teamIds.Count,
            PendingApprovals = await context.LeaveRequests
                                .CountAsync(r => teamIds.Contains(r.EmployeeId) && r.Status == "Pending"),
            Approved        = await context.LeaveRequests
                                .CountAsync(r => teamIds.Contains(r.EmployeeId) && r.Status == "Approved"),
            Rejected        = await context.LeaveRequests
                                .CountAsync(r => teamIds.Contains(r.EmployeeId) && r.Status == "Rejected")
        };
        return Ok(result);
    }

    [HttpGet("employee")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> EmployeeDashboard()
    {
        var uid = ClaimsHelper.GetUserId(User);

        var balances = await context.LeaveBalances
            .Include(b => b.LeaveType)
            .Where(b => b.EmployeeId == uid)
            .Select(b => new {
                b.LeaveType.Name,
                Remaining = b.TotalLeaves - b.UsedLeaves
            })
            .ToListAsync();

        var result = new
        {
            LeaveBalances   = balances,
            Pending         = await context.LeaveRequests.CountAsync(r => r.EmployeeId == uid && r.Status == "Pending"),
            Approved        = await context.LeaveRequests.CountAsync(r => r.EmployeeId == uid && r.Status == "Approved"),
            Rejected        = await context.LeaveRequests.CountAsync(r => r.EmployeeId == uid && r.Status == "Rejected"),
            RecentRequests  = await context.LeaveRequests
                                .Include(r => r.LeaveType)
                                .Where(r => r.EmployeeId == uid)
                                .OrderByDescending(r => r.AppliedDate)
                                .Take(5)
                                .Select(r => new {
                                    r.Id, r.LeaveType.Name, r.StartDate,
                                    r.EndDate, r.TotalDays, r.Status
                                })
                                .ToListAsync()
        };
        return Ok(result);
    }
}