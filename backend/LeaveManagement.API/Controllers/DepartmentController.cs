using LeaveManagement.API.Data;
using LeaveManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.API.Controllers;


[ApiController]
[Route("api/departments")]
[Authorize]
public class DepartmentController : ControllerBase
{
    private readonly AppDbContext context;
    public DepartmentController(AppDbContext context) => this.context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
    Ok(await context.Departments.ToListAsync());

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] Department dept)
    {
        context.Departments.Add(dept);
        await context.SaveChangesAsync();
        return Ok(dept);
    }
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] Department dept)
    {
        var existing = await context.Departments.FindAsync(id);
        if (existing == null) return NotFound();
        existing.DepartmentName = dept.DepartmentName;
        await context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles ="Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var dept = await context.Departments.FindAsync(id);
        if (dept == null) return NotFound();
        context.Departments.Remove(dept);
        await context.SaveChangesAsync();
        return Ok(new { message = "Deleted." });
    }

}