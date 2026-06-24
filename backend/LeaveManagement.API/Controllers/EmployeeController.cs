

using LeaveManagement.API.DTOs.Employee;
using LeaveManagement.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagement.API.Controllers;

[ApiController]
[Route("api/employee")]
[Authorize]
public class EmployeeController(IEmployeeService service) : ControllerBase
{
    private readonly IEmployeeService service = service;
    
    [HttpGet]
    [Authorize(Roles ="Admin, Manager")]
    public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());

    [HttpGet("{id}")]
    [Authorize(Roles ="Admin, Manager")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost]
        [Authorize(Roles ="Admin")]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
    {
        if(!ModelState.IsValid) return BadRequest(ModelState);
        var result = await service.CreateAsync(dto);
        if(result == null) return BadRequest(new {message ="Email Already exits."});
        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDto dto)
    {
        var success = await service.UpdateAsync(id, dto);
        return success ? Ok(new { message = "Updated." }) : NotFound();
    }
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await service.DeleteAsync(id);
        return success ? Ok(new { message = "Deactivated." }) : NotFound();
    }
    


}