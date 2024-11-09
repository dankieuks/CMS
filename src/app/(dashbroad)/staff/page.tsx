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
import {
  useAddUser,
  useDelete,
  useGetUser,
  useLockUser,
  useUpdateUser,
} from "@/shared/hooks/user";

const AdminPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employees[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentStaff, setCurrentStaff] = useState<Employees | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null as File | null,
  });

  const { fetchUsers } = useGetUser();
  const { deleteUser } = useDelete();
  const { addUser } = useAddUser();
  const { updateUser } = useUpdateUser();
  const { lockUser } = useLockUser();
  const getUsers = async () => {
    const users = await fetchUsers();
    setEmployees(users);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setImage(null);
    setCurrentStaff(null);
    setFormData({
      email: "",
      password: "",
      name: "",
      image: null,
    });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data before submit:", formData);

    if (!currentStaff && !formData.image) {
      message.error("Image is required for new users.");
      return;
    }

    try {
      if (currentStaff) {
        const updatedUser: Employees = {
          ...currentStaff,
          ...formData,
          image: formData.image || currentStaff.image,
        };
        await updateUser(updatedUser);
        message.success("User updated successfully");
      } else {
        await addUser(formData);
        message.success("User added successfully");
      }

      await getUsers();
    } catch (error: any) {
      const responseMessage =
        error.response?.message || "An error occurred. Please try again.";
      message.error(responseMessage);
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
  const handLockUser = async (id: string) => {
    await lockUser(id);
    await getUsers();
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
        <Button onClick={() => handLockUser(record.id)}>
          {record.isLocked ? (
            <BsFillLockFill className="text-red-600" />
          ) : (
            <BsFillUnlockFill className="text-blue-600" />
          )}
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
                image: record.image,
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
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-bold mb-4">
              {currentStaff ? "Edit Employee" : "Add Employee"}
            </h2>
            {formData.image && (
              <div className="mb-4 flex justify-center">
                <Image
                  src={
                    formData.image instanceof File
                      ? URL.createObjectURL(formData.image)
                      : ""
                  }
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
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="flex space-x-4">
              <Button color="primary" variant="solid" htmlType="submit">
                Save
              </Button>

              <Button color="danger" variant="outlined" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default AdminPage;
