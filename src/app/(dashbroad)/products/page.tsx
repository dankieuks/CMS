"use client";

import { BsPersonFillAdd } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { DeleteOutlined, ImportOutlined } from "@ant-design/icons";
import { Button, Image, message, Table } from "antd";
import { Column } from "@/shared/types/table";
import {
  useAddProduct,
  useDeleteProduct,
  useGetProduct,
  useUpdateProduct,
} from "@/shared/hooks/product";
import { Product } from "@/shared/types/product";
import { enqueueSnackbar } from "notistack";
import ProtectedRoute from "@/shared/providers/auth.provider";

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: 0,
    brand: "",
    description: "",
    image: null as string | File | null,
  });

  const { getProduct } = useGetProduct();
  const { deleteProduct } = useDeleteProduct();
  const { addProduct } = useAddProduct();
  const { updateProduct } = useUpdateProduct();
  const getProducts = async () => {
    const fetchedProducts = await getProduct();
    setProducts(fetchedProducts);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setImage(null);
    setCurrentProduct(null);
    setFormData({
      id: "",
      name: "",
      price: 0,
      brand: "",
      description: "",
      image: null as string | File | null,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "price") {
      const priceValue = Number(value);
      if (isNaN(priceValue) || priceValue < 0) {
        return;
      }

      setFormData({ ...formData, price: priceValue });
    } else {
      setFormData({ ...formData, [name]: value });
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
    if (!currentProduct && !formData.image) {
      enqueueSnackbar("Sản phẩm đang thiếu hình ảnh ", {
        variant: "warning",
        autoHideDuration: 1500,
      });
      return;
    }
    try {
      if (currentProduct) {
        const updatedProduct: Product = {
          ...currentProduct,
          ...formData,
          image: formData.image || currentProduct.image,
        };
        await updateProduct(updatedProduct);
        enqueueSnackbar("Cập nhật sản phẩm thành công", {
          variant: "success",
          autoHideDuration: 1500,
        });
      } else {
        await addProduct(formData);
        enqueueSnackbar("Thêm sản phẩm thành công ", {
          variant: "success",
          autoHideDuration: 1500,
        });
      }
      await getProducts();
    } catch {}

    closeModal();
  };
  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      enqueueSnackbar("Xóa sản phẩm thành công", {
        variant: "success",
        autoHideDuration: 1500,
      });
    } catch (error) {
      console.error("Error during form submission:", error);
      enqueueSnackbar("Xảy ra lỗi khi xóa sản phẩm", {
        variant: "error",
        autoHideDuration: 1500,
      });
    } finally {
      closeModal();
    }
  };

  const columns: Column[] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text: any, record: any, index: number) => <>{index + 1}</>,
    },
    {
      title: "Hình ảnh",
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
            alt="Product"
            style={{ width: "48px", height: "48px" }}
            className="  rounded-lg
            "
          />
        </div>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Giá  (VNĐ)",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price) => <span>{price.toLocaleString()}</span>,
    },
    {
      title: "Thông tin",
      dataIndex: "description",
      key: "description",
      align: "center",
      responsive: ["lg"],
    },

    {
      title: "Chức năng",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <>
          <Button
            color="primary"
            variant="text"
            onClick={() => {
              setCurrentProduct(record);
              setFormData({
                id: record.id,
                name: record.name,
                price: record.price,
                brand: record.brand,
                description: record.description,
                image: record.image,
              });
              openModal();
            }}
          >
            <ImportOutlined
              style={{
                fontSize: "22px",
              }}
            />
          </Button>
          <Button
            color="danger"
            variant="text"
            onClick={() => {
              handleDelete(record.id);
            }}
          >
            <DeleteOutlined
              style={{
                color: "red",
                fontSize: "22px",
              }}
            />
          </Button>
        </>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <section className=" p-6 rounded-xl">
        <div className="bg-gray-100 p-6 rounded-xl shadow-md mb-6">
          <h1 className="text-3xl font-bold mb-6">Quản lý sản phẩm</h1>
          <Button
            color="primary"
            variant="solid"
            onClick={openModal}
            style={{ marginBottom: "10px", padding: "10px" }}
          >
            <BsPersonFillAdd
              style={{
                fontSize: "26px",
              }}
            />
            Thêm sản phẩm mới
          </Button>
          <Table
            dataSource={products}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              position: ["bottomCenter"],
            }}
            className="custom-table"
          />
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-bold mb-4">
                {currentProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
              </h2>
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
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Tải hình ảnh lên
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Giá</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="my-4 ">
                  <label className="block text-sm font-medium">
                    Loại hình sản phẩm
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Chọn loại hình</option>
                    <option value="Đồ uống">Đồ uống</option>
                    <option value="Đồ Ăn">Đồ Ăn</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Thông tin bổ sung
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex space-x-4">
                <Button color="primary" variant="solid" htmlType="submit">
                  Lưu
                </Button>
                <Button color="danger" variant="outlined" onClick={closeModal}>
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
};

export default ProductManagement;
