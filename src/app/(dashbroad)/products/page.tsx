"use client";
import { BsFillUnlockFill, BsFillLockFill } from "react-icons/bs";
import { BsPersonFillAdd } from "react-icons/bs";
import React, { useState } from "react";
import { DeleteOutlined, ImportOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { Column } from "@/shared/types/table";

// Kiểu dữ liệu sản phẩm
interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  description: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      image: "https://via.placeholder.com/150",
      name: "Product A",
      price: 100,
      description: "Description for Product A",
    },
    {
      id: "2",
      image: "https://via.placeholder.com/150",
      name: "Product B",
      price: 200,
      description: "Description for Product B",
    },
  ]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setImage(null);
    setCurrentProduct(null);
    setFormData({
      name: "",
      price: 0,
      description: "",
    });
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const handleSave = () => {
    if (currentProduct) {
      // // Cập nhật sản phẩm
      // setProducts((prev) =>
      //   prev.map((product) =>
      //     product.id === currentProduct.id
      //       ? { ...product, ...formData, image }
      //       : product
      //   )
      // );
    } else {
      // Thêm sản phẩm mới
      const newProduct: Product = {
        id: `${products.length + 1}`,
        ...formData,
        image: image || "",
      };
      setProducts([...products, newProduct]);
    }
    closeModal();
  };

  const columns: Column[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (text, record) => (
        <div className="flex justify-center items-center h-full">
          <img
            src={
              record.image ||
              "https://thanhnien.mediacdn.vn/uploaded/triquang/2017_11_12/camep_OCMA.jpg?width=500"
            }
            alt="Product"
            className="w-12 h-12 rounded-md"
          />
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Price ($)",
      dataIndex: "price",
      key: "price",
      align: "center",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
    },

    {
      title: "Action",
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
                name: record.name,
                price: record.price,
                description: record.description,
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
    <section className="min-h-screen bg-gray-100 p-8 rounded-xl">
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-6">Product Management</h1>
        <Button
          color="primary"
          variant="filled"
          onClick={openModal}
          style={{ marginBottom: "10px" }}
        >
          <BsPersonFillAdd
            style={{
              fontSize: "22px",
            }}
          />
          Add Product
        </Button>
        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 20,
          }}
        />
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">
              {currentProduct ? "Edit Product" : "Add Product"}
            </h2>
            {image && (
              <div className="mb-4 flex justify-center">
                <img
                  src={image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border-4 border-gray-300"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: +e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex space-x-4">
              <Button color="primary" variant="solid" onClick={handleSave}>
                Save
              </Button>
              <Button color="danger" variant="outlined" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductManagement;
