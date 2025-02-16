"use client";
import {
  BsPersonFillAdd,
  BsFillUnlockFill,
  BsFillLockFill,
} from "react-icons/bs";
import { FaCheckCircle, FaCommentDots } from "react-icons/fa";
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
import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import { useSetRecoilState } from "recoil";
import { usersState } from "@/shared/store/Atoms/user";

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
  const setUsers = useSetRecoilState(usersState);
  const { fetchUsers } = useGetUser();
  const { deleteUser } = useDelete();
  const { addUser } = useAddUser();
  const { updateUser } = useUpdateUser();
  const { lockUser } = useLockUser();

  const getUsers = async () => {
    const users = await fetchUsers();
    setEmployees(users);
    setUsers(users);
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
    if (!currentStaff && !formData.image) {
      enqueueSnackbar("Hồ sơ đang thiếu hình ảnh !", {
        variant: "warning",
        autoHideDuration: 1500,
      });
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
        enqueueSnackbar("Cập nhật hồ sơ thành công !", {
          variant: "success",
          autoHideDuration: 1500,
        });
      } else {
        await addUser(formData);
        enqueueSnackbar("Thêm nhân viên thành công !", {
          variant: "success",
          autoHideDuration: 1500,
        });
      }

      await fetchUsers();
    } catch (error: any) {
      const responseMessage =
        error.response?.message || "An error occurred. Please try again.";
      enqueueSnackbar(responseMessage, {
        variant: "error",
        autoHideDuration: 1500,
      });
    }

    closeModal();
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      message.error("Invalid ID. Cannot delete.");
      return;
    }

    try {
      await deleteUser(id);
      setEmployees((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {}
  };

  const handLockUser = async (id: string) => {
    await lockUser(id);
    await fetchUsers();
  };

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <section className=" p-6 rounded-xl">
        <div className="bg-gray-50 p-6 rounded-xl shadow-lg mb-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Quản lý nhân viên
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 justify-center  gap-4 md:gap-x-2  md:gap-y-6 lg:gap-4">
            <Button
              color="primary"
              variant="filled"
              onClick={openModal}
              className="w-40 h-56  md:w-50 md:h-50 lg:w-60 lg:h-60 transition-all"
            >
              <BsPersonFillAdd className="mr-2" style={{ fontSize: "80px" }} />
            </Button>
            {employees.map((employee) => (
              <div>
                <div
                  key={employee.id}
                  className="relative w-40 h-56 md:w-50 md:h-50 lg:w-60 lg:h-60 bg-slate-300 flex flex-col items-center justify-center gap-2 text-center rounded-lg overflow-hidden shadow-md"
                >
                  <Button
                    className="absolute top-2 right-1 text-red-600 rounded-full z-10 bg-transparent border-none"
                    onClick={() => {
                      if (employee.id) {
                        handleDelete(employee.id);
                      } else {
                        console.error("Employee ID is undefined");
                      }
                    }}
                  >
                    <DeleteOutlined className="text-xl" />
                  </Button>
                  <Link href={`/staff/${employee.id}`}>
                    <Image
                      src={
                        employee.image instanceof File
                          ? URL.createObjectURL(employee.image)
                          : employee.image || undefined
                      }
                      alt="Preview"
                      style={{ width: "80px", height: "80px" }}
                      className="object-cover rounded-full border-4 border-indigo-400"
                    />

                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold mb-2">
                        {employee.name}
                      </span>
                      <div>
                        <span className="text-lg text-gray-600 mr-2">
                          Trạng thái:
                        </span>
                        <Button
                          onClick={() => {
                            if (employee.id) {
                              handLockUser(employee.id);
                            } else {
                              console.error("Employee ID is undefined");
                            }
                          }}
                          className={`${
                            employee.isLocked ? "bg-red-600" : "bg-green-600"
                          } text-white rounded-lg hover:bg-opacity-80 transition-all`}
                        >
                          {employee.isLocked ? (
                            <BsFillLockFill />
                          ) : (
                            <BsFillUnlockFill />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button className="bg-blue-500 mt-3 px-3 py-1 text-sm text-white rounded-md">
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Modal
          title={
            currentStaff ? "Cập nhật hồ sơ nhân viên" : "Thêm nhân viên mới"
          }
          open={showModal}
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
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSubmit}
              >
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
