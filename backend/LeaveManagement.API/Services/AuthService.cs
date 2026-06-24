
using LeaveManagement.API.Data;
using LeaveManagement.API.DTOs.Auth;
using LeaveManagement.API.Helpers;
using LeaveManagement.API.Models;
using LeaveManagement.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext context;
    private readonly JwtHelper jwtHelper;
    public AuthService(AppDbContext context, JwtHelper jwtHelper)
    {
        this.context = context;
        this.jwtHelper = jwtHelper;
    }
    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsActive);

        if(user == null)
            return null;
        if(!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return null;

        return BuildResponse(user);
    }

    private AuthResponseDto BuildResponse(User user)
    {
        return new AuthResponseDto{
            Token = jwtHelper.GenerateToken(user),
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            UserId = user.Id
        };
    }


    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
       var exists = await context.Users.AnyAsync(u => u.Email == dto.Email);
       if(exists) 
            return null;

       var user = new User
       {
          FullName = dto.FullName,
          Email = dto.Email,
          PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
          Role = dto.Role,
          DepartmentId = dto.DepartmentId,
          ManagerId = dto.ManagerId,
          IsActive = true
       };
       context.Users.Add(user);
       await context.SaveChangesAsync();

       if(user.Role == "Employee")
        {
            var leaveTypes = await context.LeaveTypes.ToListAsync();
            foreach(var lt in leaveTypes)
            {
                context.LeaveBalances.Add(new LeaveBalance
                {
                    EmployeeId = user.Id,
                    LeaveTypeId = lt.Id,
                    TotalLeaves = lt.DefaultDays,
                    UsedLeaves = 0
                });
            }
            await context.SaveChangesAsync();

        }
        return BuildResponse(user);

    }
}