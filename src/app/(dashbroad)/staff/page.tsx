"use client";
import {
  BsPersonFillAdd,
  BsFillUnlockFill,
  BsFillLockFill,
} from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { DeleteOutlined, ImportOutlined } from "@ant-design/icons";
import { Employees } from "@/shared/types/user";
import { Button, Image, message, Table, Modal } from "antd";
import { Column } from "@/shared/types/table";
import {
  useAddUser,
  useDelete,
  useGetUser,
  useLockUser,
  useUpdateUser,
} from "@/shared/hooks/user";
import ProtectedRoute from "@/shared/providers/auth.provider";

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
            className="rounded-full border-2 border-gray-300"
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
        <Button
          onClick={() => handLockUser(record.id)}
          className={`${
            record.isLocked ? "bg-red-600" : "bg-blue-600"
          } text-white rounded-lg hover:bg-opacity-80 transition-all`}
        >
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
                image: record.image,
              });
              openModal();
            }}
            className="mr-2"
          >
            <ImportOutlined style={{ fontSize: "22px" }} />
          </Button>

          <Button
            color="danger"
            variant="text"
            onClick={() => handleDelete(record.id)}
            className="mr-2"
          >
            <DeleteOutlined style={{ color: "red", fontSize: "22px" }} />
          </Button>
        </>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <section className="min-h-screen bg-gray-50 p-8 rounded-xl">
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Staff Management
          </h1>
          <Button
            color="primary"
            variant="filled"
            onClick={openModal}
            className="mb-6  transition-all"
          >
            <BsPersonFillAdd className="mr-2" style={{ fontSize: "22px" }} />
            Add Employee
          </Button>
          <Table
            dataSource={employees}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 7,
              position: ["bottomCenter"],
            }}
          />
        </div>
        <Modal
          title={currentStaff ? "Edit Employee" : "Add Employee"}
          visible={showModal}
          onCancel={closeModal}
          footer={null}
          destroyOnClose
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formData.image && (
              <div className="mb-4 flex justify-center">
                <Image
                  src={
                    formData.image instanceof File
                      ? URL.createObjectURL(formData.image)
                      : formData.image
                  }
                  alt="Preview"
                  style={{ width: "128px", height: "128px" }}
                  className="object-cover rounded-full border-4 border-gray-300"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-between mt-4">
              <Button
                onClick={closeModal}
                className="bg-gray-400 hover:bg-gray-500 text-white"
              >
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Submit
              </Button>
            </div>
          </form>
        </Modal>
      </section>
    </ProtectedRoute>
  );
};

export default AdminPage;
