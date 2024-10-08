"use client";
import React, { useState } from "react";

interface Employee {
  id: number;
  name: string;
  hourlyRate: number; // Mức lương theo giờ
}

interface Shift {
  name: string;
  hoursWorked: number; // Số giờ đã làm
}

const employees: Employee[] = [
  { id: 1, name: "Nguyễn Văn A", hourlyRate: 100000 },
  { id: 2, name: "Trần Thị B", hourlyRate: 120000 },
  { id: 3, name: "Lê Văn C", hourlyRate: 110000 },
];

// Các ca làm việc có thể
const shifts: Shift[] = [
  { name: "Ca Sáng", hoursWorked: 0 },
  { name: "Ca Chiều", hoursWorked: 0 },
  { name: "Ca Tối", hoursWorked: 0 },
];

const EmployeeSalaryCalculator: React.FC = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [selectedShift, setSelectedShift] = useState<string>("");
  const [hoursWorked, setHoursWorked] = useState<number>(0);
  const [salaries, setSalaries] = useState<{ [key: string]: number }>({}); // Lưu trữ lương cho từng ca

  const handleCalculateSalary = () => {
    if (selectedEmployeeId !== null && selectedShift) {
      const selectedEmployee = employees.find(
        (emp) => emp.id === selectedEmployeeId
      );
      if (selectedEmployee) {
        const calculatedSalary = selectedEmployee.hourlyRate * hoursWorked; // Tính lương theo giờ
        setSalaries((prev) => ({
          ...prev,
          [`${selectedEmployee.name} - ${selectedShift}`]: calculatedSalary,
        }));
        // Reset số giờ đã làm cho ca đó
        setHoursWorked(0);
        setSelectedShift("");
      }
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h1 className="text-xl font-bold mb-4">Tính Lương Nhân Viên</h1>

      {/* Dropdown chọn nhân viên */}
      <div className="mb-4">
        <label className="block font-semibold">Chọn Nhân Viên:</label>
        <select
          value={selectedEmployeeId || ""}
          onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
          className="border p-2 rounded-md w-full"
        >
          <option value="">Chọn nhân viên</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} - {emp.hourlyRate.toLocaleString()} VND/giờ
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown chọn ca làm việc */}
      <div className="mb-4">
        <label className="block font-semibold">Chọn Ca Làm Việc:</label>
        <select
          value={selectedShift}
          onChange={(e) => setSelectedShift(e.target.value)}
          className="border p-2 rounded-md w-full"
        >
          <option value="">Chọn ca làm việc</option>
          {shifts.map((shift) => (
            <option key={shift.name} value={shift.name}>
              {shift.name}
            </option>
          ))}
        </select>
      </div>

      {/* Nhập số giờ làm việc */}
      <div className="mb-4">
        <label className="block font-semibold">Số Giờ Làm Việc:</label>
        <input
          type="number"
          value={hoursWorked}
          onChange={(e) => setHoursWorked(Number(e.target.value))}
          className="border p-2 rounded-md w-full"
          min={0}
        />
      </div>

      {/* Nút tính lương */}
      <button
        onClick={handleCalculateSalary}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
      >
        Tính Lương
      </button>

      {/* Hiển thị lương */}
      <div className="mt-4">
        {Object.entries(salaries).map(([key, salary]) => (
          <div key={key} className="font-bold">
            Lương của {key}: {salary.toLocaleString()} VND
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeSalaryCalculator;
