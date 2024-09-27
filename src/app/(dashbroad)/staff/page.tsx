"use client";
import React, { useState } from "react";

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  isLocked: boolean;
}

const AdminPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Manager",
      isLocked: false,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Staff",
      isLocked: false,
    },
  ]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Employee>({
    id: employees.length + 1,
    name: "",
    email: "",
    role: "",
    isLocked: false,
  });

  // Mở modal để thêm hoặc chỉnh sửa nhân viên
  const openModal = (employee?: Employee) => {
    if (employee) {
      setCurrentEmployee(employee);
      setFormData(employee);
    } else {
      setCurrentEmployee(null);
      setFormData({
        id: employees.length + 1,
        name: "",
        email: "",
        role: "",
        isLocked: false,
      });
    }
    setShowModal(true);
  };

  // Đóng modal
  const closeModal = () => {
    setShowModal(false);
    setCurrentEmployee(null);
  };

  // Hàm xử lý thay đổi form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Lưu nhân viên (Thêm mới hoặc Cập nhật)
  const saveEmployee = () => {
    if (currentEmployee) {
      // Cập nhật nhân viên
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === currentEmployee.id ? formData : emp))
      );
    } else {
      // Thêm nhân viên mới
      setEmployees((prev) => [
        ...prev,
        { ...formData, id: employees.length + 1 },
      ]);
    }
    closeModal();
  };

  // Hàm khóa/mở khóa tài khoản nhân viên
  const toggleLockAccount = (id: number) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, isLocked: !emp.isLocked } : emp
      )
    );
  };

  // Hàm xóa nhân viên
  const deleteEmployee = (id: number) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-6">Employee Management</h1>

        <button
          onClick={() => openModal()}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Add Employee
        </button>

        {/* Bảng danh sách nhân viên */}
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="bg-white border-b">
                <td className="px-4 py-2">{employee.id}</td>
                <td className="px-4 py-2">{employee.name}</td>
                <td className="px-4 py-2">{employee.email}</td>
                <td className="px-4 py-2">{employee.role}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => openModal(employee)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleLockAccount(employee.id)}
                    className={`px-4 py-2 rounded-md text-white ${
                      employee.isLocked ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {employee.isLocked ? "Unlock" : "Lock"}
                  </button>
                  <button
                    onClick={() => deleteEmployee(employee.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Chỉnh sửa nhân viên */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">
              {currentEmployee ? "Edit Employee" : "Add Employee"}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={saveEmployee}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
