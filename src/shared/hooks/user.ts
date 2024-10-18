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
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        newUser
      );
      setUsers((prevUsers) => [...prevUsers, response.data]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error adding user:", error.message);
        console.error("Response:", error.response);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return { addUser };
};
export const useUpdateUser = () => {
  const setUsers = useSetRecoilState(usersState);

  const updateUser = async (updateUser: Employees) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${updateUser.id}`,
        {
          name: updateUser.name,
          email: updateUser.email,
          role: updateUser.role,
          isLocked: updateUser.isLocked,
          hoursWorked: updateUser.hoursWorked,
          hourlyRate: updateUser.hourlyRate,
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updateUser.id ? response.data : user
        )
      );
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating user:", error.message);
        console.error("Response:", error.response);
      } else {
        console.error("Unexpected error:", error);
      }
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
