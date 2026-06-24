# 🗓️ Employee Leave Management System

A full-stack web application built with **ASP.NET Core Web API (.NET 8)** 
and **React + Vite + Tailwind CSS**.

## 🚀 Features

- JWT-based authentication with role-based access control
- Three roles: **Admin**, **Manager**, **Employee**
- Leave application, approval, rejection, and cancellation workflow
- Automatic leave balance tracking
- Role-specific dashboards and protected routes

## 🛠️ Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Backend  | ASP.NET Core Web API (.NET 8)           |
| Database | SQL Server + Entity Framework Core 8    |
| Auth     | JWT Bearer + BCrypt                     |
| Frontend | React 18 + Vite                         |
| Styling  | Tailwind CSS                            |
| HTTP     | Axios                                   |

## 📦 Setup

### Backend

```bash
cd backend/LeaveManagement.API
# Update connection string in appsettings.json
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

### Frontend

```bash
cd frontend/leave-management-client
npm install
npm run dev
```

## 🔐 Sample Credentials

| Role     | Email                   | Password      |
|----------|-------------------------|---------------|
| Admin    | admin@company.com       | Admin@123     |
| Manager  | manager@company.com     | Manager@123   |
| Employee | john@company.com        | Employee@123  |

## 📋 API Endpoints

- `POST /api/auth/login`
- `GET  /api/employees` *(Admin/Manager)*
- `POST /api/leaverequests/apply` *(Employee)*
- `PUT  /api/leaverequests/{id}/approve` *(Manager)*
- `GET  /api/dashboard/admin` *(Admin)*
- ...and more

## 📁 Project Structure
EmployeeLeaveManagement/

├── backend/LeaveManagement.API/

│   ├── Controllers/

│   ├── Models/

│   ├── Services/

│   ├── DTOs/

│   └── Data/

└── frontend/leave-management-client/

└── src/

├── pages/

├── services/

├── context/

└── layouts/