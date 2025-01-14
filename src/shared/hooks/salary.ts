// hooks/useSalaries.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { Employees } from "@/shared/types/user";
import { SalaryData } from "../types/salary";

export const useSalaries = (month: string, userIds: string[]) => {
  const [salaries, setSalaries] = useState<SalaryData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userIds.length === 0) return;

    const fetchSalaries = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/income/calculate-salaries`,
          {
            params: {
              month,
              userIds: JSON.stringify(userIds),
            },
          }
        );

        if (response.data.message === "Tính lương thành công") {
          setSalaries(response.data.data);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching salaries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, [month, userIds]);

  return { salaries, loading };
};
