
using LeaveManagement.API.Data;
using LeaveManagement.API.DTOs.Employee;
using LeaveManagement.API.Models;
using LeaveManagement.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.API.Services;

public class EmployeeService(AppDbContext context) : IEmployeeService
{
    private readonly AppDbContext _context = context;

    public async Task<EmployeeResponseDto> CreateAsync(CreateEmployeeDto dto)
    {
        var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
        if(exists)
            return null;
        var user = new User
        {
            FullName =dto.FullName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role,
            DepartmentId = dto.DepartmentId ?? 0,
            ManagerId = dto.ManagerId,
            IsActive = true

        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        if(user.Role == "Employee")
        {
            var types = await _context.LeaveTypes.ToListAsync();
            foreach(var lt in types)
            {
                _context.LeaveBalances.Add(new LeaveBalance
                {
                    EmployeeId = user.Id,
                    LeaveTypeId = lt.Id,
                    TotalLeaves = lt.DefaultDays,
                    UsedLeaves = 0
                });
            }
            await _context.SaveChangesAsync();
        }
        return await GetByIdAsync(user.Id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if(user == null) return false;

        user.IsActive = false;
        await _context.SaveChangesAsync();
        return true;

    }

    public async Task<List<EmployeeResponseDto>> GetAllAsync()
    {
        return await _context.Users
            .Include(u=> u.Department)
            .Include(u => u.Manager)
            .Select(u => MapToDto(u))
            .ToListAsync();
    }

    public async Task<EmployeeResponseDto> GetByIdAsync(int id)
    {
        var user = await _context.Users
            .Include(u => u.Department)
            .Include(u => u.Manager)
            .FirstOrDefaultAsync(u => u.Id == id);
        return user == null ? null : MapToDto(user);

    }

    public async Task<bool> UpdateAsync(int id, UpdateEmployeeDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if(user == null) return false;

        user.FullName = dto.FullName;
        user.Role = dto.Role;
        user.DepartmentId = dto.DepartmentId ?? user.DepartmentId;
        user.ManagerId = dto.ManagerId;
        user.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return true;
    }

    private static EmployeeResponseDto MapToDto(User u) => new()
    {
        Id = u.Id,
        FullName = u.FullName,
        Email = u.Email,
        Role = u.Role,
        DepartmentId = u.DepartmentId,
        DepartmentName = u.Department?.DepartmentName,
        ManagerName = u.Manager?.FullName,
        ManagerId = u.ManagerId,
        IsActive = u.IsActive,
        CreatedAt = u.CreatedAt
    };
}