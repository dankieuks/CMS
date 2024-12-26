"use client";
import React, { useState } from "react";
import { Table, Avatar, Tag, Button } from "antd";
import { Employees } from "@/shared/types/user";
import { Column } from "@/shared/types/table";
import ProtectedRoute from "@/shared/providers/auth.provider";
import * as XLSX from "xlsx";

const EmployeeSalaryTable = () => {
  const [employees, setEmployees] = useState<Employees[]>([
    {
      id: "1",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSILPqTXqLj8vJ9ePsxBrkRz4k0w7IPzOCiPA&s",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Manager",
      isLocked: false,
      hoursWorked: 40,
      hourlyRate: 15,
    },
    {
      id: "2",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn7ECoI9CfwEAvZERO52n405DF4md6CDwdEg&s",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Staff",
      isLocked: false,
      hoursWorked: 45,
      hourlyRate: 18,
    },
    {
      id: "3",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy6ZEdBbDCfV5G5XyM8a9h6EB2K9UhV_i6Tg&s",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "Staff",
      isLocked: false,
      hoursWorked: 38,
      hourlyRate: 20,
    },
    {
      id: "4",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTowvSz0GQF0f_MXBN4cV-bfkz5b_kLmKfHg&s",
      name: "Bob Brown",
      email: "bob.brown@example.com",
      role: "Manager",
      isLocked: false,
      hoursWorked: 50,
      hourlyRate: 25,
    },
    {
      id: "5",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1xXHUDr7ReU2L_5VeQF9c_W8dGZPkZxxqCQ&s",
      name: "Charlie Taylor",
      email: "charlie.taylor@example.com",
      role: "Intern",
      isLocked: false,
      hoursWorked: 20,
      hourlyRate: 10,
    },
    {
      id: "6",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9IuOqDY5OG9LKoW8qP3PQjmdjHDmTZf6aIA&s",
      name: "Diana Wilson",
      email: "diana.wilson@example.com",
      role: "Staff",
      isLocked: false,
      hoursWorked: 42,
      hourlyRate: 19,
    },
    {
      id: "7",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5y3JXOwUVZc4Ttd4xeBLPxzxgYNuVkM8Aqg&s",
      name: "Ethan Miller",
      email: "ethan.miller@example.com",
      role: "Manager",
      isLocked: false,
      hoursWorked: 48,
      hourlyRate: 22,
    },
    {
      id: "8",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7E4Wi0L4R7zH6j9d5Ryof1J8rxvGZVZtNfQ&s",
      name: "Fiona Garcia",
      email: "fiona.garcia@example.com",
      role: "Staff",
      isLocked: false,
      hoursWorked: 36,
      hourlyRate: 17,
    },
  ]);

  const calculateSalary = (hoursWorked: number, hourlyRate: number) => {
    return hoursWorked * hourlyRate;
  };

  const roleColor = (role: string) => {
    switch (role) {
      case "Manager":
        return "blue";
      case "Staff":
        return "green";
      default:
        return "gray";
    }
  };
  const handleExportExcel = () => {
    const data = employees.map((employee) => ({
      Name: employee.name,
      Email: employee.email,
      Role: employee.role,
      "Hours Worked": employee.hoursWorked,
      "Hourly Rate ($)": employee.hourlyRate,
      "Salary ($)": calculateSalary(employee.hoursWorked, employee.hourlyRate),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Salaries");

    // Xuất file Excel
    XLSX.writeFile(workbook, "Employee_Salaries.xlsx");
  };
  const columns: Column[] = [
    {
      title: "Avatar",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (text: string) => <Avatar src={text} size="large" />,
    },
    {
      title: "Employee Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text: string, record: Employees) => (
        <div className="flex flex-col items-center">
          <span className="font-semibold">{text}</span>
          <span className="text-sm text-gray-500">{record.email}</span>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role: string) => <Tag color={roleColor(role)}>{role}</Tag>,
    },
    {
      title: "Hours Worked",
      dataIndex: "hoursWorked",
      key: "hoursWorked",
      align: "center",
      render: (text: number) => <span className="text-blue-600">{text}h</span>,
    },
    {
      title: "Hourly Rate ($)",
      dataIndex: "hourlyRate",
      key: "hourlyRate",
      align: "center",
      render: (text: number) => (
        <span className="text-green-600 font-semibold">${text}</span>
      ),
    },
    {
      title: "Salary ($)",
      key: "salary",
      align: "center",
      render: (text: any, record: Employees) => (
        <span className="text-red-600 font-bold">
          ${calculateSalary(record.hoursWorked ?? 0, record.hourlyRate ?? 0)}
        </span>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <section className="min-h-screen bg-gray-100 p-8 rounded-xl">
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Employee Salary Table
            </h2>
            <Button
              type="primary"
              onClick={handleExportExcel}
              className="bg-blue-500 text-white"
            >
              Export to Excel
            </Button>
          </div>
          <Table
            dataSource={employees.map((employee) => ({
              ...employee,
              key: employee.id,
            }))}
            columns={columns}
            pagination={false}
            bordered
            className="rounded-xl"
          />
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default EmployeeSalaryTable;
