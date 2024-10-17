"use client";
import {
  BsPersonFillAdd,
  BsFillUnlockFill,
  BsFillLockFill,
} from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { DeleteOutlined, ImportOutlined } from "@ant-design/icons";
import { Employees } from "@/shared/types/user";
import { Button, Image, message, Table } from "antd";
import { Column } from "@/shared/types/table";
import { getUsers, useAddUser, useDelete } from "@/shared/hooks/user";

const AdminPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employees[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentStaff, setCurrentStaff] = useState<Employees | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const { fetchUsers } = getUsers();
  const { deleteUser } = useDelete();
  const { addUser } = useAddUser();

  const getProducts = async () => {
    const users = await fetchUsers();
    setEmployees(users);
  };

  useEffect(() => {
    getProducts();
  }, []);

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
    setFormData({
      email: "",
      password: "",
      name: "",
    });
    setImage(null);
    setCurrentStaff(null); // Reset current staff when closing modal
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (currentStaff) {
      // Update user
      const updatedUser: Employees = {
        ...currentStaff,
        ...formData,
        image: image || currentStaff.image,
      };

      // Update local state immediately
      setEmployees((prev) =>
        prev.map((user) => (user.id === currentStaff.id ? updatedUser : user))
      );
    } else {
      // Add new user
      const newUser: Employees = {
        id: `${employees.length + 1}`,
        ...formData,
        image: image || "",
        isLocked: false,
      };
      await addUser(newUser);
      setEmployees((prev) => [...prev, newUser]);
    }
    closeModal();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);

      setEmployees((prev) => prev.filter((user) => user.id !== id));
      message.success("Successfully deleted.");
    } catch (error) {
      message.error("Failed to delete user.");
    }
  };

  const columns: Column[] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index: number) => <>{index + 1}</>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (text, record) => (
        <div className="flex justify-center items-center h-full">
          <Image
            src={
              record.image ||
              "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
            }
            alt="Employee Image"
            style={{ width: "48px", height: "48px" }}
            className="rounded-lg"
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
      responsive: ["lg"],
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
        <Button>
          {record.isLocked ? <BsFillLockFill /> : <BsFillUnlockFill />}
        </Button>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <>
          <Button
            color="primary"
            variant="text"
            onClick={() => {
              setCurrentStaff(record);
              setFormData({
                name: record.name,
                email: record.email,
                password: record.password,
              });
              openModal();
            }}
          >
            <ImportOutlined style={{ fontSize: "22px" }} />
          </Button>

          <Button
            color="danger"
            variant="text"
            onClick={() => handleDelete(record.id)}
          >
            <DeleteOutlined style={{ color: "red", fontSize: "22px" }} />
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
          <BsPersonFillAdd style={{ fontSize: "22px" }} />
          Add Employee
        </Button>
        <Table
          dataSource={employees}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 7,
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
                <Image
                  src={image}
                  alt="Preview"
                  style={{ width: "128px", height: "128px" }}
                  className="object-cover rounded-full border-4 border-gray-300"
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
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex space-x-4">
              <Button color="primary" variant="solid" onClick={handleSave}>
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
