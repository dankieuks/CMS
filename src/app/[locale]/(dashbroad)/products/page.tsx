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

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    brand: "",
    description: "",
    image: null as File | null,
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
      name: "",
      price: 0,
      brand: "",
      description: "",
      image: null,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0];
      if (file) {
        setImage(URL.createObjectURL(file));
      }
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
      message.error("Image is required for new users.");
      return;
    }
    try {
      if (currentProduct) {
        const updatedProduct: Product = {
          ...currentProduct,
          ...formData,
          image: image || currentProduct.image,
        };
        await updateProduct(updatedProduct);
        message.success("Product updated Successfully ");
      } else {
        await addProduct(formData);
        message.success("Product added successfully ");
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
      message.success("Successfully deleted.");
    } catch (error) {
      console.error("Error during form submission:", error);
      message.error("Failed to save user.");
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
      title: "Image",
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
      responsive: ["lg"],
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
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-bold mb-4">
              {currentProduct ? "Edit Product" : "Add Product"}
            </h2>
            {formData.image && (
              <div className="mb-4 flex justify-center">
                <Image
                  src={
                    formData.image instanceof File
                      ? URL.createObjectURL(formData.image)
                      : ""
                  }
                  alt="Preview"
                  style={{ width: "128px", height: "128px" }}
                  className="object-cover rounded-full border-4 border-gray-300"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Name</label>
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
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="mb-4">
                <label className="block text-sm font-medium">Brand</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select a brand</option>
                  <option value="BrandA">Đồ uống</option>
                  <option value="BrandB">Đồ Ăn</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
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
                Save
              </Button>
              <Button color="danger" variant="outlined" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default ProductManagement;
