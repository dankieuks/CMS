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
  const { getProduct } = useGetProduct();
  const { deleteProduct } = useDeleteProduct();
  const { addProduct } = useAddProduct();
  const { updateProduct } = useUpdateProduct();
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
  });

  const fetchProducts = async () => {
    const fetchedProducts = await getProduct();
    setProducts(fetchedProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      message.success("Successfully deleted.");
    } catch (error) {
      message.error("Failed to delete product.");
    }
  };

  const handleSave = async () => {
    if (currentProduct) {
      const updatedProduct = {
        ...currentProduct,
        ...formData,
        image: image || currentProduct.image,
      };
      await updateProduct(updatedProduct);
    } else {
      // Add new product
      const newProduct: Product = {
        id: `${products.length + 1}`,
        ...formData,
        image: image || "",
      };
      await addProduct(newProduct);
      setProducts([...products, newProduct]);
    }
    closeModal();
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
