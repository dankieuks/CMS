"use client";
import { BiAddToQueue } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  Modal,
  Form,
  Input,
  Button,
  Select,
  message,
  Switch,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import * as XLSX from "xlsx";

import { useGetUser } from "@/shared/hooks/user";
import { Employees } from "@/shared/types/user";
import { useRecoilValue } from "recoil";
import { authState } from "@/shared/store/Atoms/auth";

const { Option } = Select;

const shifts = [
  { label: "Sáng", value: "Ca Sáng", time: "08:00 - 12:00", color: "#FFA500" }, // Màu cam
  {
    label: "Chiều",
    value: "Ca Chiều",
    time: "12:00 - 16:00",
    color: "#32CD32",
  }, // Màu xanh lá
  { label: "Tối", value: "Ca Tối", time: "16:00 - 20:00", color: "#1E90FF" }, // Màu xanh dương
];

const WorkScheduleCalendar = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [form] = Form.useForm();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [employees, setEmployees] = useState<Employees[]>([]);
  const auth = useRecoilValue(authState);
  const [loading, setLoading] = useState(false);
  const getUsers = async () => {
    const users = await fetchUsers();
    setEmployees(users);
  };
  const { fetchUsers } = useGetUser();
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/system-settings/edit-schedule`
      );
      console.log("Dữ liệu từ API:", response.data);
      setIsReadOnly(response.data.isEnabled);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      message.error("Không thể lấy trạng thái lịch!");
    }
  };
  useEffect(() => {
    getUsers();

    fetchData();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/schedule`
      );
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      message.error("Không thể tải dữ liệu lịch làm việc!");
    }
  };

  const handleAddSchedule = async (values: any) => {
    const { employeeId, shift } = values;

    if (!employeeId || !shift) {
      message.error("Vui lòng chọn nhân viên và ca làm việc.");
      return;
    }

    const selectedShift = shifts.find((s) => s.value === shift);

    if (!selectedShift) {
      message.error("Ca làm việc không hợp lệ.");
      return;
    }

    if (!selectedDate) {
      message.error("Vui lòng chọn ngày.");
      return;
    }

    const formattedDate = dayjs(selectedDate).toISOString();

    if (getShiftsCountForDate(selectedDate!, shift) >= 3) {
      message.error("Ca làm việc này đã đủ số lượng đăng ký!");
      return;
    }

    const newSchedule = {
      userId: employeeId,
      date: formattedDate,
      shifts: [shift],
      hoursWorked: 4,
      status: "active",
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/schedule`,
        newSchedule
      );
      message.success("Thêm lịch làm việc thành công!");
      form.resetFields();
      setIsModalVisible(false);
      fetchSchedules();
    } catch (error) {
      console.error("Error creating schedule:", error);
      message.error("Không thể thêm trùng lịch làm việc!");
    }
  };

  const getSchedulesForDate = (date: Dayjs) => {
    return schedules.filter((schedule) =>
      dayjs(schedule.date).isSame(date, "day")
    );
  };

  const getShiftsCountForDate = (date: Dayjs, shift: string) => {
    return schedules.filter(
      (schedule) =>
        dayjs(schedule.date).isSame(date, "day") && schedule.shift === shift
    ).length;
  };

  const dateCellRender = (value: Dayjs) => {
    const daySchedules = getSchedulesForDate(value);

    return (
      <ul className="flex flex-col !text-3xl">
        {!isReadOnly && (
          <Button
            type="default"
            danger
            onClick={() => setIsModalVisible(true)}
            style={{ float: "right" }}
          >
            <BiAddToQueue />
          </Button>
        )}
        {daySchedules.map((schedule) => {
          const employee = employees.find((e) => e.id === schedule.userId);
          const shiftDetails = shifts.find(
            (s) => s.value === schedule.shifts[0]
          );
          return (
            <div
              key={schedule.id}
              className="text-[14px] my-[-5px] flex justify-between items-center px-2 py-1 rounded-lg"
              style={{
                backgroundColor: shiftDetails?.color || "#ccc",
                color: "#fff",
              }}
            >
              <span>
                {employee?.name} - {schedule.shifts.join(", ")}
              </span>

              {!isReadOnly && (
                <Button
                  type="link"
                  danger
                  onClick={() => handleDeleteSchedule(schedule.id)}
                >
                  Xóa
                </Button>
              )}
            </div>
          );
        })}
      </ul>
    );
  };

  const handleDateSelect = (date: Dayjs) => {
    const today = dayjs();
    if (date.isBefore(today, "day")) {
      message.warning("Không thể chỉnh sửa lịch làm việc cho ngày đã qua.");
      setIsReadOnly(true);
    } else {
      setSelectedDate(date);
    }
  };

  const exportToExcel = () => {
    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();

    const filteredSchedules = schedules.filter((schedule) => {
      const scheduleDate = dayjs(schedule.date);
      return (
        scheduleDate.month() === currentMonth &&
        scheduleDate.year() === currentYear
      );
    });

    const scheduleData = filteredSchedules.map((schedule) => {
      const employee = employees.find((e) => e.id === schedule.userId);
      return {
        Ngày: dayjs(schedule.date).format("DD/MM/YYYY"),
        "Nhân viên": employee?.name,
        "Ca làm việc": schedule.shifts.join(", "),
        "Giờ làm": schedule.hoursWorked,
        "Ghi chú": schedule.notes || "N/A",
      };
    });

    if (scheduleData.length === 0) {
      message.info("Không có lịch làm việc trong tháng hiện tại!");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(scheduleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lịch làm việc tháng hiện tại");

    const fileName = `lich_lam_viec_${dayjs().format("MM_YYYY")}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/schedule/${scheduleId}`
      );
      message.success("Xóa lịch làm việc thành công!");
      fetchSchedules();
    } catch (error) {
      console.error("Error deleting schedule:", error);
      message.error("Không thể xóa lịch làm việc!");
    }
  };

  const handleToggleEdit = async () => {
    const newStatus = !isReadOnly;
    setIsReadOnly(newStatus);
    try {
      setLoading(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/system-settings/edit-schedule/toggle`,
        {
          isEnabled: newStatus,
        }
      );
      setIsReadOnly(newStatus);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white m-6 p-3 md:p-6 rounded-xl shadow-md  ">
      <div className="flex flex-col md:flex-row  gap-4 justify-between items-center text-center">
        <h2 className="text-3xl font-bold  text-gray-800">
          Lịch làm việc hàng tháng
        </h2>

        <div className="flex flex-row gap-x-11">
          <Button
            type="default"
            onClick={fetchData}
            className="p-4 text-lg bg text-red-500"
          >
            Cập nhật chế độ chỉnh sửa lịch
          </Button>

          <span className="text-lg">
            {isReadOnly ? "Chỉ xem" : "Chỉnh sửa"}
          </span>
          <Switch
            checked={!isReadOnly}
            onChange={handleToggleEdit}
            disabled={auth?.user?.role === "STAFF"}
          />
          <Button
            type="primary"
            onClick={exportToExcel}
            className="p-4 text-lg"
          >
            Xuất Excel
          </Button>
        </div>
      </div>
      <Calendar
        cellRender={dateCellRender}
        onSelect={handleDateSelect}
        mode="month"
        style={{ fontSize: "18px" }}
      />

      <Modal
        title="Thêm lịch làm việc mới"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        style={{ fontSize: "20px" }}
      >
        <Form layout="vertical" form={form} onFinish={handleAddSchedule}>
          <Form.Item
            label="Nhân viên"
            name="employeeId"
            rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}
          >
            <Select placeholder="Chọn nhân viên">
              {employees.map((employee) => (
                <Option key={employee.id} value={employee.id}>
                  {employee.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Ca làm việc"
            name="shift"
            rules={[{ required: true, message: "Vui lòng chọn ca làm việc!" }]}
          >
            <Select placeholder="Chọn ca làm việc">
              {shifts.map((shift) => (
                <Option key={shift.value} value={shift.value}>
                  {shift.label} ({shift.time})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Ghi chú" name="notes">
            <Input.TextArea
              rows={3}
              placeholder="Thêm ghi chú (không bắt buộc)"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block disabled={isReadOnly}>
            Thêm lịch
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkScheduleCalendar;
