using LeaveManagement.API.DTOs.LeaveRequest;
using LeaveManagement.API.Helpers;
using LeaveManagement.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagement.API.Controllers;

[ApiController]
[Route("api/leaverequests")]
[Authorize]
public class LeaveRequestController : ControllerBase
{
    private readonly ILeaveRequestService service;
    public LeaveRequestController(ILeaveRequestService service) => this.service = service;

    // Employee applies for leave
    [HttpPost("apply")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> Apply([FromBody] ApplyLeaveDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var uid = ClaimsHelper.GetUserId(User);
        var (success, msg) = await service.ApplyAsync(uid, dto);
        return success ? Ok(new { message = msg }) : BadRequest(new { message = msg });
    }

    // Employee views their own leave requests
    [HttpGet("my")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> GetMy()
    {
        var uid = ClaimsHelper.GetUserId(User);
        return Ok(await service.GetMyLeavesAsync(uid));
    }

    // Manager views pending requests for their team
    [HttpGet("pending")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> GetPending()
    {
        var uid = ClaimsHelper.GetUserId(User);
        return Ok(await service.GetPendingForManagerAsync(uid));
    }

    // Manager views all requests for their team
    [HttpGet("team")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> GetTeamHistory()
    {
        var uid = ClaimsHelper.GetUserId(User);
        return Ok(await service.GetTeamHistoryAsync(uid));
    }

    // Admin views all leave requests
    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll() =>
        Ok(await service.GetAllAsync());

    // Manager approves a request
    [HttpPut("{id}/approve")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> Approve(int id, [FromBody] ApproveRejectDto dto)
    {
        var uid = ClaimsHelper.GetUserId(User);
        var (success, msg) = await service.ApproveAsync(id, uid, dto);
        return success ? Ok(new { message = msg }) : BadRequest(new { message = msg });
    }

    // Manager rejects a request
    [HttpPut("{id}/reject")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> Reject(int id, [FromBody] ApproveRejectDto dto)
    {
        var uid = ClaimsHelper.GetUserId(User);
        var (success, msg) = await service.RejectAsync(id, uid, dto);
        return success ? Ok(new { message = msg }) : BadRequest(new { message = msg });
    }

    // Employee cancels a pending request
    [HttpPut("{id}/cancel")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> Cancel(int id)
    {
        var uid = ClaimsHelper.GetUserId(User);
        var (success, msg) = await service.CancelAsync(id, uid);
        return success ? Ok(new { message = msg }) : BadRequest(new { message = msg });
    }
}