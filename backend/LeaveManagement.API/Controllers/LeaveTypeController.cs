using LeaveManagement.API.Data;
using LeaveManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.API.Controllers;

[ApiController]
[Route("api/leavetypes")]
[Authorize]
public class LeaveTypeController : ControllerBase
{
    private readonly AppDbContext context;
    public LeaveTypeController(AppDbContext context) => this.context = context;
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
                 Ok(await context.LeaveTypes.ToListAsync());

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] LeaveType lt)
    {
        context.LeaveTypes.Add(lt);
        await context.SaveChangesAsync();
        return Ok(lt);
    }
   
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] LeaveType lt)
    {
        var existing = await context.LeaveTypes.FindAsync(id);
        if (existing == null) return NotFound();
        existing.Name = lt.Name;
        existing.Description = lt.Description;
        existing.DefaultDays = lt.DefaultDays;
        await context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var lt = await context.LeaveTypes.FindAsync(id);
        if(lt == null)
            return NotFound();
        context.LeaveTypes.Remove(lt);
        await context.SaveChangesAsync();
        return Ok(new {message ="Deleted..."});
    }




}