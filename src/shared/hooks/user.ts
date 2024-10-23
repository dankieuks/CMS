import { useSetRecoilState } from "recoil";
import axios from "axios";
import { usersState } from "../store/Atoms/user";
import { Employees } from "@/shared/types/user";

export const getUsers = () => {
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

export const useAddUser = () => {
  const setUsers = useSetRecoilState(usersState);

  const addUser = async (newUser: Employees) => {
    const formData = new FormData();

    formData.append("name", newUser.name);
    formData.append("email", newUser.email);
    formData.append("password", newUser.password);

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
      console.log(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`);

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

    formData.append("name", updateUser.name);
    formData.append("email", updateUser.email);
    formData.append("password", updateUser.password);

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
      console.log("User updated successfully:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating user:", error.message);
        console.error("Response:", error.response);
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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting user:", error.message);
        console.error("Response:", error.response);
      } else {
        console.error("Unexpected error:", error);
      }

      throw error;
    }
  };

  return { deleteUser };
};
