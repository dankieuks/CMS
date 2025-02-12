import { useSetRecoilState } from "recoil";
import axios from "axios";
import { usersState } from "../store/Atoms/user";
import { Employees } from "@/shared/types/user";
import { authState } from "../store/Atoms/auth";
import { enqueueSnackbar } from "notistack";

export const useGetMe = () => {
  const setAuth = useSetRecoilState(authState);

  const getMeData = async (): Promise<Employees | null> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Không có token trong localStorage");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data;
      setAuth((prev) => ({
        ...prev,
        isLoggedIn: true,
        accessToken: token,
        user: userData,
      }));
      return userData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Lỗi khi lấy thông tin người dùng:", error.message);
        console.error("Chi tiết lỗi từ server:", error.response?.data);
      } else {
        console.error("Lỗi không mong đợi:", error);
      }
      return null;
    }
  };

  return { getMeData };
};

export const useGetUser = () => {
  const setUsers = useSetRecoilState(usersState);

  const fetchUsers = async (): Promise<Employees[]> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user`
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Lỗi khi lấy người dùng:", error.message);
        console.error("Chi tiết lỗi từ server:", error.response);
      } else {
        console.error("Lỗi không mong đợi:", error);
      }

      return [];
    }
  };

  return { fetchUsers, setUsers };
};
export const useGetById = () => {
  const setUsers = useSetRecoilState(usersState);

  const getUserById = async (id: string): Promise<Employees> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${id}`
      );

      const user: Employees = response.data;

      setUsers((prevUsers) => [...prevUsers, user]);

      return user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching user:", error.message);
        console.error("Response:", error.response);
      } else {
        console.error("Unexpected error:", error);
      }

      throw error;
    }
  };

  return { getUserById };
};

export const useAddUser = () => {
  const setUsers = useSetRecoilState(usersState);

  const addUser = async (newUser: Employees) => {
    const formData = new FormData();

    formData.append("name", newUser.name);
    formData.append("email", newUser.email);
    if (newUser.password) {
      formData.append("password", newUser.password);
    }

    if (newUser.image) {
      formData.append("image", newUser.image);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUsers((prevUsers) => [...prevUsers, response.data]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error("Email already exists");
        }
        console.error("Error adding user:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  };

  return { addUser };
};

export const useUpdateUser = () => {
  const setUsers = useSetRecoilState(usersState);

  const updateUser = async (updateUser: Employees) => {
    const formData = new FormData();

    if (updateUser.name) formData.append("name", updateUser.name);
    if (updateUser.email) formData.append("email", updateUser.email);

    if (updateUser.bankCode)
      formData.append("bankCode", String(updateUser.bankCode));

    if (updateUser.bank) formData.append("bank", updateUser.bank);
    // if (updateUser.role) formData.append("bank", updateUser.role);
    if (updateUser.hourlyRate)
      formData.append("hourlyRate", String(updateUser.hourlyRate));
    if (updateUser.image) {
      formData.append("image", updateUser.image);
    }

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${updateUser.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updateUser.id ? response.data : user
        )
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        enqueueSnackbar(error.message, {
          variant: "success",
          autoHideDuration: 1500,
        });
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  };

  return { updateUser };
};

export const useDelete = () => {
  const setUsers = useSetRecoilState(usersState);

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`);

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      enqueueSnackbar("Xóa tài khoản thành công", {
        variant: "success",
        autoHideDuration: 1500,
      });
    } catch (error) {
      enqueueSnackbar("Xảy ra lỗi khi xóa tài khoản", {
        variant: "error",
        autoHideDuration: 1500,
      });

      throw error;
    }
  };

  return { deleteUser };
};

export const useLockUser = () => {
  const setUsers = useSetRecoilState(usersState);

  const lockUser = async (id: string) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${id}/lock`
      );

      setUsers((prevUsers) => {
        return prevUsers.map((user) => (user.id === id ? response.data : user));
      });
      enqueueSnackbar("Cập nhật trạng thái tài khoản thành công", {
        variant: "error",
        autoHideDuration: 1500,
      });
    } catch (error: any) {
      enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 1500,
      });
    }
  };

  return { lockUser };
};
