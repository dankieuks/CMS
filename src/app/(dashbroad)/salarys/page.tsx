"use client";
import React, { useState } from "react";
import { Table } from "antd";
import { Employees } from "@/shared/types/user"; // Import kiểu Staff nếu đã được định nghĩa
import { Column } from "@/shared/types/table";

const EmployeeSalaryTable = () => {
  // Dữ liệu danh sách nhân viên
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
      email: "janeSmith@example.com",
      role: "Staff",
      isLocked: false,
      hoursWorked: 40,
      hourlyRate: 18,
    },
  ]);

  // Hàm tính lương cho mỗi nhân viên
  const calculateSalary = (hoursWorked: number, hourlyRate: number) => {
    return hoursWorked * hourlyRate;
  };

  const columns: Column[] = [
    {
      title: "Employee ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Employee Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Hours Worked",
      dataIndex: "hoursWorked",
      key: "hoursWorked",
      align: "center",
    },
    {
      title: "Hourly Rate ($)",
      dataIndex: "hourlyRate",
      key: "hourlyRate",
      align: "center",
    },
    {
      title: "Salary ($)",
      key: "salary",
      dataIndex: "salary",
      align: "center",
      render: (text: any, record: Employees) => {
        return (
          <span>
            {calculateSalary(record.hoursWorked ?? 0, record.hourlyRate ?? 0)}$
          </span>
        );
      },
    },
  ];
  return (
    <section className="min-h-screen bg-gray-100 p-8 rounded-xl">
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-6">Employee Salary Table</h2>
        <Table
          dataSource={employees.map((employee) => ({
            ...employee,
            key: employee.id,
          }))}
          columns={columns}
          pagination={false}
        />
      </div>
    </section>
  );
};

export default EmployeeSalaryTable;
