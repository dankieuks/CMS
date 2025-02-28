"use client";
import React, { useState, useEffect } from "react";
import { Table, Input, Spin, Button } from "antd";
import { Employees } from "@/shared/types/user";
import { useGetUser } from "@/shared/hooks/user";
import { useSalaries } from "@/shared/hooks/salary";
import { Column } from "@/shared/types/table";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import * as XLSX from "xlsx";
import ProtectedRoute from "@/shared/providers/auth.provider";
const SalaryComponent: React.FC = () => {
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [userIds, setUserIds] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employees[]>([]);
  const { salaries, loading } = useSalaries(month, userIds);
  const { fetchUsers } = useGetUser();

  const getUsers = async () => {
    const users = await fetchUsers();
    setEmployees(users);
    const userIdsFromEmployees = users
      .map((employee) => employee.id)
      .filter((id): id is string => id !== undefined);
    setUserIds(userIdsFromEmployees);
  };

  useEffect(() => {
    getUsers();
    dayjs.locale("vi");
  }, []);
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(e.target.value);
  };
  const getEmployeeNameById = (id: string) => {
    const employee = employees.find((emp) => emp.id === id);
    return employee ? employee.name : "Tên không có sẵn";
  };

  const columns: Column[] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text: any, record: any, index: number) => (
        <span>{index + 1}</span>
      ),
    },
    {
      title: "Nhân Viên",
      dataIndex: "userId",
      key: "userId",
      align: "center",
      render: (userId: string) => <span>{getEmployeeNameById(userId)}</span>,
    },
    {
      title: "Số Giờ Làm",
      dataIndex: "totalHoursWorked",
      key: "totalHoursWorked",
      align: "center",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Lương(VND)",
      dataIndex: "salary",
      key: "salary",
      align: "center",
      render: (text: string) => (
        <span>{parseFloat(text).toLocaleString()}</span>
      ),
      className: "font-medium text-center text-green-600",
    },
  ];
  const formattedMonth = dayjs(month).format("MMMM YYYY");
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      salaries.map((salary) => ({
        STT: salaries.indexOf(salary) + 1,
        "Nhân Viên": getEmployeeNameById(salary.userId),
        "Số Giờ Làm": salary.totalHoursWorked,
        "Lương (VND)": parseFloat(salary.salary.toString()).toLocaleString(),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lương");
    XLSX.writeFile(wb, `Danh_Sach_Luong_${formattedMonth}.xlsx`);
  };
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="p-6 m-6 bg-gray-100  rounded-lg">
        <div className="mb-6 flex flex-row justify-between items-center">
          <h2 className="text-3xl font-semibold text-gray-800 ">
            Bảng lương {` ${formattedMonth}`}
          </h2>

          <Input
            type="month"
            value={month}
            onChange={handleMonthChange}
            className="p-2 text-lg font-bold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent w-full sm:w-auto"
          />
        </div>
        <div className="mb-4">
          <Button
            type="primary"
            onClick={exportToExcel}
            className="bg-blue-600 text-white border-none shadow-md rounded-md p-2"
          >
            Xuất file Excel
          </Button>
        </div>
        {loading ? (
          <div className="text-center">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={salaries}
            rowKey="userId"
            loading={loading}
            pagination={{
              pageSize: 10,
              position: ["bottomCenter"],
            }}
            className=" custom-table shadow-md rounded-md text-xl"
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default SalaryComponent;
