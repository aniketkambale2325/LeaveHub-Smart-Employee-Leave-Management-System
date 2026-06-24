using LeaveManagement.API.Models;

namespace LeaveManagement.API.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (!context.Departments.Any())
        {
            context.Departments.AddRange(
                new Department { DepartmentName = "Engineering" },
                new Department { DepartmentName = "Human Resources" }
            );
            context.SaveChanges();
        }

        if (!context.LeaveTypes.Any())
        {
            context.LeaveTypes.AddRange(
                new LeaveType { Name = "Sick Leave", Description = "Medical leave", DefaultDays = 10 },
                new LeaveType { Name = "Casual Leave", Description = "Personal leave", DefaultDays = 12 },
                new LeaveType { Name = "Paid Leave", Description = "Annual leave", DefaultDays = 15 }
            );
            context.SaveChanges();
        }

        if (context.Users.Any())
            return;

        var engineering = context.Departments.First(d => d.DepartmentName == "Engineering");
        var hr = context.Departments.First(d => d.DepartmentName == "Human Resources");

        var admin = new User
        {
            FullName = "System Admin",
            Email = "admin@company.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = "Admin",
            DepartmentId = engineering.Id,
            IsActive = true
        };

        var manager = new User
        {
            FullName = "Jane Manager",
            Email = "manager@company.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Manager@123"),
            Role = "Manager",
            DepartmentId = engineering.Id,
            IsActive = true
        };

        var employee1 = new User
        {
            FullName = "John Employee",
            Email = "john@company.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Employee@123"),
            Role = "Employee",
            DepartmentId = engineering.Id,
            IsActive = true
        };

        var employee2 = new User
        {
            FullName = "Sara Smith",
            Email = "sara@company.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Employee@123"),
            Role = "Employee",
            DepartmentId = hr.Id,
            IsActive = true
        };

        context.Users.AddRange(admin, manager, employee1, employee2);
        context.SaveChanges();

        employee1.ManagerId = manager.Id;
        employee2.ManagerId = manager.Id;
        context.SaveChanges();

        var leaveTypes = context.LeaveTypes.ToList();
        foreach (var emp in new[] { employee1, employee2 })
        {
            foreach (var lt in leaveTypes)
            {
                context.LeaveBalances.Add(new LeaveBalance
                {
                    EmployeeId = emp.Id,
                    LeaveTypeId = lt.Id,
                    TotalLeaves = lt.DefaultDays,
                    UsedLeaves = 0
                });
            }
        }

        context.SaveChanges();
    }
}
