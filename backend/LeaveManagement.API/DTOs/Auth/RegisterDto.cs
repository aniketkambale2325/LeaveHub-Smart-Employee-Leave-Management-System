
using System.ComponentModel.DataAnnotations;

namespace LeaveManagement.API.DTOs.Auth;

public class RegisterDto
{
    [Required]  
     public string FullName {get; set;} = string.Empty;
    [Required, EmailAddress]
    public string Email {get; set;} = string.Empty;
    [Required, MinLength(8)]
    public string Password  {get; set;} = string.Empty;

    public string Role {get; set;} = "Employee";

    public int DepartmentId {get; set;}
    public int ManagerId {get; set;}
}