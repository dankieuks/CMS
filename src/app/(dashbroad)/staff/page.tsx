"use client";
import { BsPersonFillAdd } from "react-icons/bs";
import { BsFillUnlockFill } from "react-icons/bs";
import { BsFillLockFill } from "react-icons/bs";
import React, { useState } from "react";
import { DeleteOutlined, ImportOutlined } from "@ant-design/icons";
import { Employees } from "@/shared/types/user";
import { Button, Table } from "antd";
import { Column } from "@/shared/types/table";

const AdminPage: React.FC = () => {
  const [employees, setEmployee] = useState<Employees[]>([
    {
      id: " 1",
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
      hourlyRate: 15,
    },
  ]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentStaff, setCurrentStaff] = useState<Employees | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "abcd1234",
    username: "",
    name: "",
  });
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setEmployee((prev) => prev.filter((staff) => staff.id !== id));
  };
  const columns: Column[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (text, record) => (
        <div className="flex justify-center items-center h-full">
          <img
            src={record.image || "path/to/default/image.png"}
            alt="Staff"
            className="w-12 h-12 rounded-md"
          />
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "isLocked",
      key: "isLocked",
      align: "center",
      render: (text, record) => (
        <>
          <Button>
            {record.isLocked ? <BsFillLockFill /> : <BsFillUnlockFill />}
          </Button>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <>
          <Button color="primary" variant="text">
            <ImportOutlined
              style={{
                fontSize: "22px",
              }}
            />
          </Button>
          <Button
            color="danger"
            variant="text"
            onClick={() => {
              handleDelete(record.id);
            }}
          >
            <DeleteOutlined
              style={{
                color: "red",
                fontSize: "22px",
              }}
            />
          </Button>
        </>
      ),
    },
  ];

  return (
    <section className="min-h-screen bg-gray-100 p-8 rounded-xl">
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-6">Staff Management</h1>
        <Button
          color="primary"
          variant="filled"
          onClick={openModal}
          style={{ marginBottom: "10px" }}
        >
          <BsPersonFillAdd
            style={{
              fontSize: "22px",
            }}
          />
          Add
        </Button>
        <Table
          dataSource={employees}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 20,
          }}
        />
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">
              {currentStaff ? "Edit Employee" : "Add Employee"}
            </h2>
            {image && (
              <div className="mb-4 flex justify-center">
                <img
                  src={image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-full border-4 border-gray-300"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex space-x-4">
              <Button color="primary" variant="solid">
                Save
              </Button>
              <Button color="danger" variant="outlined" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminPage;
