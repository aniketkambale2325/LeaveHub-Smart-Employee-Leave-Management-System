
using LeaveManagement.API.DTOs.Employee;

namespace LeaveManagement.API.Services.Interfaces;

public interface IEmployeeService
{
    Task<List<EmployeeResponseDto>> GetAllAsync();

    Task<EmployeeResponseDto> GetByIdAsync(int id);

    Task<EmployeeResponseDto> CreateAsync(CreateEmployeeDto dto);

    Task<bool> UpdateAsync(int id, UpdateEmployeeDto dto);
    Task<bool> DeleteAsync(int id);

}