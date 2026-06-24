using LeaveManagement.API.Data;
using LeaveManagement.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.API.Controllers;

[ApiController]
[Route("api/leavebalances")]
[Authorize]
public class LeaveBalanceController : ControllerBase
{
    private readonly AppDbContext context;
    public LeaveBalanceController(AppDbContext context) => this.context = context;

    // Employee views their own balance
    [HttpGet("my")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> GetMy()
    {
        var uid = ClaimsHelper.GetUserId(User);
        var balances = await context.LeaveBalances
            .Include(b => b.LeaveType)
            .Where(b => b.EmployeeId == uid)
            .Select(b => new {
                b.Id,
                b.LeaveTypeId,
                LeaveTypeName  = b.LeaveType.Name,
                b.TotalLeaves,
                b.UsedLeaves,
                RemainingLeaves = b.TotalLeaves - b.UsedLeaves
            })
            .ToListAsync();
        return Ok(balances);
    }

    // Admin/Manager views a specific employee's balance
    [HttpGet("{employeeId}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GetByEmployee(int employeeId)
    {
        var balances = await context.LeaveBalances
            .Include(b => b.LeaveType)
            .Where(b => b.EmployeeId == employeeId)
            .Select(b => new {
                b.Id,
                b.LeaveTypeId,
                LeaveTypeName   = b.LeaveType.Name,
                b.TotalLeaves,
                b.UsedLeaves,
                RemainingLeaves = b.TotalLeaves - b.UsedLeaves
            })
            .ToListAsync();
        return Ok(balances);
    }

    // Admin updates leave balance
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBalanceDto dto)
    {
        var balance = await context.LeaveBalances.FindAsync(id);
        if (balance == null) return NotFound();

        balance.TotalLeaves = dto.TotalLeaves;
        balance.UsedLeaves  = dto.UsedLeaves;
        await context.SaveChangesAsync();
        return Ok(new { message = "Balance updated." });
    }

    public record UpdateBalanceDto(int TotalLeaves, int UsedLeaves);
}