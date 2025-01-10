"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaTiktok } from "react-icons/fa";
import { AiFillTwitterCircle, AiFillInstagram } from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";
import { useParams, useRouter } from "next/navigation";
import { useGetById, useUpdateUser } from "@/shared/hooks/user";
import { Employees } from "@/shared/types/user";
import { Image, message } from "antd";
import { enqueueSnackbar } from "notistack";

const StaffDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const { getUserById } = useGetById();
  const [employees, setEmployees] = useState<Employees | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    bankCode: null as number | null,
    bank: "",
    isLocked: false,
    createdAt: "",
    updatedAt: "",
    image: null as string | File | null,
  });
  const { updateUser } = useUpdateUser();
  const bankList = [
    "Vietcombank",
    "Techcombank",
    "BIDV",
    "Sacombank",
    "VietinBank",
    "ACB",
    "MB Bank",
    "SHB",
    "Eximbank",
    "VPBank",
    "Timo",
  ];
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, bank: e.target.value });
  };
  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        const user = await getUserById(id as string);
        setEmployees(user);
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          password: "",
          role: user?.role || "",
          bankCode: user?.bankCode || null,
          bank: user?.bank || "",
          isLocked: user?.isLocked || false,
          createdAt: user?.createdAt
            ? new Date(user.createdAt).toISOString()
            : "",
          updatedAt: user?.updatedAt
            ? new Date(user.updatedAt).toISOString()
            : "",
          image: user?.image || null,
        });
      }
    };
    fetchUser();
  }, [id]);
  console.log("formData", formData);
  console.log("employees", employees);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value || "" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setFormData({
        name: employees?.name || "",
        email: employees?.email || "",
        password: "",
        role: employees?.role || "staff",
        bankCode: employees?.bankCode || null,
        bank: employees?.bank || "",
        isLocked: employees?.isLocked || false,
        createdAt: employees?.createdAt
          ? new Date(employees.createdAt).toISOString()
          : "",
        updatedAt: employees?.updatedAt
          ? new Date(employees.updatedAt).toISOString()
          : "",
        image: employees?.image || null,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (employees) {
        const updatedUser: Employees = {
          ...employees,
          ...formData,
          image: formData.image || employees.image,
        };
        await updateUser(updatedUser);
        setEmployees(updatedUser);
        setIsEditing(false);
        enqueueSnackbar("Cập nhật hồ sơ thành công !", {
          variant: "success",
          autoHideDuration: 1500,
        });
      } else {
        enqueueSnackbar("Không có dữ liệu nào cần cập nhật !", {
          variant: "info",
          autoHideDuration: 1500,
        });
      }
    } catch (error) {
      enqueueSnackbar("Xảy ra lỗi khi cập nhật !", {
        variant: "error",
        autoHideDuration: 1500,
      });
    }
  };
  return (
    <section className=" mt-12 mx-6 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-blue-500 p-6 text-white">
        <div className="flex justify-between items-center">
          <button
            className="bg-gray-300 text-center w-32 rounded-2xl h-10 relative text-black text-xl font-semibold group"
            type="button"
            onClick={() => router.back()}
          >
            <div className="bg-green-400 rounded-xl h-8 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[119px] z-10 duration-500">
              <AiOutlineArrowLeft />
            </div>
            <p className="translate-x-2">Back</p>
          </button>

          <h1 className=" flex flex-row text-2xl font-bold">
            Thông tin cá nhân:
            <p className="text-red-200"> {employees?.name}</p>
          </h1>
          <button className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg">
            My Data
          </button>
        </div>
      </div>
      <div className="p-6 flex flex-col lg:flex-row gap-6 text-lg">
        <div className="flex-1 bg-gradient-to-r from-indigo-100 to-blue-50 p-6 rounded-lg shadow-lg">
          <div className="w-full">
            <div className="mb-4 flex justify-center">
              {formData.image && (
                <div className="flex flex-col justify-center items-center">
                  <Image
                    src={
                      formData.image instanceof File
                        ? URL.createObjectURL(formData.image)
                        : formData.image
                    }
                    alt="Preview"
                    style={{ width: "128px", height: "128px" }}
                    className="object-cover rounded-full border-4 border-indigo-400"
                  />
                  {isEditing && (
                    <div className="">
                      <input
                        type="file"
                        title="Upload Image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border-none py-2 border rounded-lg mt-2 bg-indigo-50 text-indigo-800 hover:bg-indigo-100"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {[
              { label: "Name", name: "name", value: formData.name },
              { label: "Email", name: "email", value: formData.email },
              {
                label: "Số tài khoản ngân hàng",
                name: "bankCode",
                value: formData.bankCode,
              },
              {
                label: "Ngân hàng",
                name: "bank",
                value: formData.bank,
                isEditable: true,
              },
              {
                label: "Chức vụ",
                name: "role",
                value: formData.role,
                isEditable: false,
              },
              {
                label: "Trạng thái tài khoản",
                name: "isLocked",
                value: formData.isLocked ? "Đã khóa" : "Bình thường",
                isEditable: false,
              },
              {
                label: "Ngày tham gia",
                name: "createdAt",
                value: new Date(formData?.createdAt ?? "").toLocaleString(),
                isEditable: false,
              },
              {
                label: "Ngày cập nhật mới",
                name: "updatedAt",
                value: new Date(formData?.updatedAt ?? "").toLocaleString(),
                isEditable: false,
              },
            ].map(({ label, name, value, isEditable = true }, index) => (
              <div className="mb-4 text-lg" key={index}>
                <label className="block text-indigo-700  font-semibold">
                  {label}
                </label>
                {isEditable && isEditing ? (
                  name === "bank" ? (
                    <select
                      name={name}
                      value={value ?? ""}
                      onChange={handleSelectChange}
                      className="w-full border rounded px-2 py-2  text-indigo-900 bg-indigo-50 hover:bg-indigo-100"
                    >
                      <option value="" disabled>
                        Select Bank
                      </option>
                      {bankList.map((bank, index) => (
                        <option key={index} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={name}
                      value={value ?? ""}
                      onChange={handleInputChange}
                      className="w-full border rounded px-2 py-2  text-indigo-900 bg-indigo-50 hover:bg-indigo-100"
                    />
                  )
                ) : (
                  <p className="text-gray-600 text-lg">{value}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Professional Details */}
        <div className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Professional Details
          </h2>
          <p className="text-gray-600 mb-4">
            Add more details about the staff's role, achievements, or other
            professional information here.
          </p>
          <div className="flex items-center space-x-4 justify-center">
            <a
              href="https://www.facebook.com/dankieu.ks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
            >
              <span className="text-2xl">
                <i className="react-icons">
                  <BsFacebook />
                </i>
              </span>
              <span>Facebook</span>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-700 flex items-center space-x-2"
            >
              <span className="text-2xl">
                <i className="react-icons">
                  <AiFillInstagram />
                </i>
              </span>
              <span>Instagram</span>
            </a>

            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black-400 hover:text-blue-600 flex items-center space-x-2"
            >
              <span className="text-2xl">
                <i className="react-icons">
                  <FaTiktok />
                </i>
              </span>
              <span>TikTok</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-600 flex items-center space-x-2"
            >
              <span className="text-2xl">
                <i className="react-icons">
                  <AiFillTwitterCircle />
                </i>
              </span>
              <span>Twitter</span>
            </a>
          </div>
        </div>

        {/* Edit & Save Buttons */}
      </div>
      <div className="w-full flex justify-center mb-4 gap-10">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          onClick={handleEditToggle}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
        {isEditing && (
          <button
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            onClick={handleSubmit}
          >
            Save
          </button>
        )}
      </div>
    </section>
  );
};

export default StaffDetail;
