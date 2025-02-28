"use client";
import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Form,
  Space,
  message,
  Popconfirm,
  Collapse,
  Select,
} from "antd";
import axios from "axios";
import ProtectedRoute from "@/shared/providers/auth.provider";

interface StockEntry {
  id?: string;
  ingredient: string;
  quantity: string;
  unit: string;
  supplier: string;
}

interface StockEntryBatch {
  id: string;
  createdAt: string;
  entries: StockEntry[];
}

export default function StockManagement() {
  const [form] = Form.useForm();
  const [batches, setBatches] = useState<StockEntryBatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<StockEntry[]>([
    { ingredient: "", quantity: "", unit: "", supplier: "" },
  ]);

  useEffect(() => {
    fetchStockBatches();
  }, []);

  const fetchStockBatches = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/stock/batches`
      );
      setBatches(data);
    } catch (error) {
      message.error("Lỗi khi lấy dữ liệu kho.");
    }
    setLoading(false);
  };

  const handleAddStockBatch = async () => {
    try {
      const formattedEntries = entries.filter(
        (entry) => entry.ingredient.trim() && entry.quantity && entry.unit
      );

      if (formattedEntries.length === 0) {
        message.error("Vui lòng nhập ít nhất một nguyên liệu hợp lệ!");
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/stock/add-multiple`,
        formattedEntries
      );
      message.success("Nhập kho thành công!");
      setEntries([{ ingredient: "", quantity: "", unit: "", supplier: "" }]);
      fetchStockBatches();
    } catch (error) {
      message.error("Lỗi khi nhập kho.");
    }
  };

  const handleDeleteBatch = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/stock/batches/${id}`
      );
      message.success("Xóa thành công!");
      fetchStockBatches();
    } catch (error) {
      message.error("Lỗi khi xóa.");
    }
  };

  const handleEntryChange = (
    index: number,
    field: keyof StockEntry,
    value: string | number
  ) => {
    const updatedEntries = [...entries];
    updatedEntries[index][field] = String(value);
    setEntries(updatedEntries);
  };

  const addNewEntry = () => {
    setEntries([
      ...entries,
      { ingredient: "", quantity: "", unit: "", supplier: "" },
    ]);
  };

  const removeEntry = (index: number) => {
    if (entries.length === 1) {
      message.warning("Phải có ít nhất một nguyên liệu.");
      return;
    }
    setEntries(entries.filter((_, i) => i !== index));
  };

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="p-6 m-6 bg-white rounded-xl shadow-md space-y-6 ">
        <h1 className="text-3xl font-bold text-gray-800 ">📦 Quản lý kho</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddStockBatch}
          className="space-y-4 "
        >
          {entries.map((entry, index) => (
            <div key={index} className="flex space-x-4 items-center h-10">
              <Input
                placeholder="Tên nguyên liệu"
                value={entry.ingredient}
                className="w-1/4 h-10 text-[18px]"
                onChange={(e) =>
                  handleEntryChange(index, "ingredient", e.target.value)
                }
                required
              />
              <Input
                type="number"
                placeholder="Số lượng"
                value={entry.quantity}
                className="w-1/6 h-10 text-[18px]"
                onChange={(e) =>
                  handleEntryChange(index, "quantity", e.target.value)
                }
                required
              />
              <Select
                placeholder="Chọn đơn vị"
                className="w-1/6 h-10 text-[18px]"
                value={entry.unit}
                onChange={(value) => handleEntryChange(index, "unit", value)}
              >
                <Select.Option value="kg">Kilogram (kg)</Select.Option>
                <Select.Option value="g">Gram (g)</Select.Option>
                <Select.Option value="l">Lít (l)</Select.Option>
                <Select.Option value="ml">Mililít (ml)</Select.Option>
                <Select.Option value="pcs">Cái (pcs)</Select.Option>
                <Select.Option value="pcs">Bịch</Select.Option>
              </Select>
              <Input
                placeholder="Nhà cung cấp"
                value={entry.supplier}
                className="w-1/4 h-10 text-[18px]"
                onChange={(e) =>
                  handleEntryChange(index, "supplier", e.target.value)
                }
                required
              />
              <Button
                onClick={() => removeEntry(index)}
                danger
                className="bg-red-500 text-black h-10 px-8 text-[18px]"
              >
                Xóa
              </Button>
            </div>
          ))}
          <div className="flex justify-start gap-x-16">
            <Button
              type="dashed"
              onClick={addNewEntry}
              className="bg-blue-500 text-white h-10 text-[18px]"
            >
              + Thêm nguyên liệu
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-green-500 text-white h-10 text-[18px]"
            >
              Nhập kho
            </Button>
          </div>
        </Form>
        <Collapse accordion className="bg-gray-100 rounded-lg p-4 shadow-md">
          {batches.map((batch) => (
            <Collapse.Panel
              key={batch.id}
              header={`📅 Lần nhập: ${new Date(
                batch.createdAt
              ).toLocaleString()}`}
              className="bg-white rounded-lg shadow-md text-[18px] "
            >
              <Table
                columns={[
                  {
                    title: "Nguyên liệu",
                    dataIndex: "ingredient",
                    key: "ingredient",
                  },
                  { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
                  { title: "Đơn vị", dataIndex: "unit", key: "unit" },
                  {
                    title: "Nhà cung cấp",
                    dataIndex: "supplier",
                    key: "supplier",
                  },
                ]}
                dataSource={batch.entries}
                rowKey="id"
                pagination={false}
                size="small"
                className=" custom-table border rounded-lg text-lg"
              />
              <Popconfirm
                title="Xóa lần nhập này?"
                onConfirm={() => handleDeleteBatch(batch.id)}
              >
                <Button danger className="bg-red-500 text-black  mt-4">
                  Xóa lần nhập kho
                </Button>
              </Popconfirm>
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>
    </ProtectedRoute>
  );
}
