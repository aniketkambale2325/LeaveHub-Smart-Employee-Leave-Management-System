
using LeaveManagement.API.DTOs.Auth;
using LeaveManagement.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace LeaveManagement.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService authService;

    public AuthController(IAuthService authService)
    {
        this.authService = authService;
    }
    
    //Post /api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login ([FromBody]LoginDto dto)
    {
        if(!ModelState.IsValid)
            return BadRequest(ModelState);
        
        var result = await authService.LoginAsync(dto);
        if(result == null)
            return Unauthorized(new {message = "Invalid email or password."});
        
        return Ok(result);
        
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register ([FromBody] RegisterDto dto)
    {
        if(!ModelState.IsValid)
            return BadRequest(ModelState);
    
        var result = await authService.RegisterAsync(dto);
        if(result == null)
            return BadRequest(new {message = "Email already exists."});

        return Ok(result);
    }


}