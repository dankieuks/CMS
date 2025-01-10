"use client";
import React, { useState } from "react";
import {
  Calendar,
  Badge,
  Popover,
  Avatar,
  Modal,
  Form,
  Input,
  Button,
  Select,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";

const { Option } = Select;

const employees = [
  { id: "1", name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: "2", name: "Jane Smith", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: "3", name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?img=3" },
];

const shifts = [
  { label: "Sáng", value: "morning", time: "08:00 - 12:00" },
  { label: "Chiều", value: "afternoon", time: "12:00 - 16:00" },
  { label: "Tối", value: "evening", time: "16:00 - 20:00" },
];

const WorkScheduleCalendar = () => {
  const [schedules, setSchedules] = useState<any[]>([
    {
      id: "1",
      employeeId: "1",
      date: "2024-12-10",
      time: "08:00 - 12:00",
      notes: "Ca sáng",
    },
    {
      id: "2",
      employeeId: "2",
      date: "2024-12-10",
      time: "16:00 - 20:00",
      notes: "Ca tối",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [form] = Form.useForm();

  const getSchedulesForDate = (date: Dayjs) => {
    return schedules.filter((schedule) =>
      dayjs(schedule.date).isSame(date, "day")
    );
  };

  const dateCellRender = (value: Dayjs) => {
    const daySchedules = getSchedulesForDate(value);

    return (
      <ul className="m-0 p-0 list-none">
        {daySchedules.map((schedule) => {
          const employee = employees.find((e) => e.id === schedule.employeeId);
          return (
            <Popover
              key={schedule.id}
              title={employee?.name}
              content={
                <div>
                  <p>
                    <strong>Thời gian:</strong> {schedule.time}
                  </p>
                  <p>
                    <strong>Ghi chú:</strong> {schedule.notes}
                  </p>
                </div>
              }
            >
              <div className="flex items-center gap-2">
                {/* <Avatar size="small" src={employee?.avatar} /> */}
                <span className="text-[10px]">{employee?.name}</span>
              </div>
            </Popover>
          );
        })}
      </ul>
    );
  };

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
    setIsModalVisible(true);
  };

  const handleAddSchedule = (values: any) => {
    const { employeeId, shift, notes } = values;
    const selectedShift = shifts.find((s) => s.value === shift);

    const newSchedule = {
      id: (schedules.length + 1).toString(),
      employeeId,
      date: selectedDate?.format("YYYY-MM-DD"),
      time: selectedShift?.time,
      notes,
    };

    setSchedules((prev) => [...prev, newSchedule]);
    message.success("Thêm lịch làm việc thành công!");
    form.resetFields();
    setIsModalVisible(false);
  };

  return (
    <div className=" bg-gray-100 ">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Lịch làm việc hàng tháng
        </h2>
        <Calendar
          dateCellRender={dateCellRender}
          onSelect={handleDateSelect}
          fullscreen={true}
        />
        <Modal
          title="Thêm lịch làm việc mới"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
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
              rules={[
                { required: true, message: "Vui lòng chọn ca làm việc!" },
              ]}
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
            <Button type="primary" htmlType="submit" block>
              Thêm lịch
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default WorkScheduleCalendar;
