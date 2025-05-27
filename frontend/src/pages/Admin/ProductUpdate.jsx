import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import {
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";

export const ProductUpdate = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id);
  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name);
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);

  const navigate = useNavigate();

  const { data: categories = [] } = useFetchCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const res = await updateProduct({
        productId: params._id,
        formData,
      }).unwrap();

      toast.success(`${res.name} is Updated`);
      navigate("/admin/allProductslist");
    } catch (error) {
      console.error(error);
      toast.error("Product update failed. Try Again.");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure u want to delete this product? "
      );
      if (!answer) return;
      const { data } = await deleteProduct(params._id);
      toast.success(`${data.name} is deleted successfully`);
      navigate("/admin/allProductslist");
    } catch (error) {
      console.error(error);
      toast.error("Deletion failed. Try Again.");
    }
  };

  return (
    <>
      <div className="container xl:mx-36 sm:mx-0 px-4 ">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="md:w-3/4 w-full p-4 flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Update / Delete Product</h2>

            {image && (
              <div className="text-center mb-4">
                <img
                  src={image}
                  alt="product"
                  className="block mx-auto w-full max-w-md object-contain"
                />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-white text-center cursor-pointer font-bold py-6 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all">
                {image?.name || "Upload Image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="block text-blue-500 mt-2 font-semibold"
                >
                  {image ? "Change Image" : "Click to Upload"}
                </label>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="stock">Count In Stock</label>
                <input
                  type="text"
                  id="stock"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSubmit}
                className="py-3 px-8 rounded-lg text-lg font-bold bg-green-600 hover:bg-green-700 transition"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="py-3 px-8 rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
