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
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaImage,
  FaBox,
  FaDollarSign,
  FaTags,
  FaBuilding,
  FaWarehouse,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes,
  FaUpload,
  FaEye,
} from "react-icons/fa";
import Loader from "../../components/Loader";

export const ProductUpdate = () => {
  const params = useParams();
  const {
    data: productData,
    isLoading,
    error,
  } = useGetProductByIdQuery(params._id);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { data: categories = [] } = useFetchCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price || "");
      setCategory(productData.category?._id || "");
      setQuantity(productData.quantity || "");
      setBrand(productData.brand || "");
      setImage(productData.image || "");
      setStock(productData.countInStock || "");
    }
  }, [productData]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Product name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!price || price <= 0) newErrors.price = "Valid price is required";
    if (!category) newErrors.category = "Category is required";
    if (!quantity || quantity <= 0)
      newErrors.quantity = "Valid quantity is required";
    if (!brand.trim()) newErrors.brand = "Brand is required";
    if (stock < 0) newErrors.stock = "Stock cannot be negative";
    if (!image) newErrors.image = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImage(res.image);
      clearError("image");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);
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

      toast.success(`${res.name} updated successfully`);
      navigate("/admin/allProductslist");
    } catch (error) {
      console.error(error);
      toast.error("Product update failed. Try Again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      );
      if (!answer) return;

      const { data } = await deleteProduct(params._id);
      toast.success(`${data.name} deleted successfully`);
      navigate("/admin/allProductslist");
    } catch (error) {
      console.error(error);
      toast.error("Deletion failed. Try Again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FaExclamationTriangle className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Error Loading Product
            </h2>
            <p className="text-gray-400 mb-6">
              There was an error loading the product. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FaBox className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-400 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FaEdit className="text-[#50C878]" />
            Update Product
          </h1>
          <p className="text-gray-400">
            Modify product information and settings
          </p>
        </div>

        {/* Admin Menu and Form */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admin Menu */}
          <div className="absolute">
            <AdminMenu />
          </div>

          {/* Form */}
          <div className="flex-1">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaBox className="text-[#50C878]" />
                  Product Information
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Section */}
                <div className="bg-gradient-to-br from-[#101011] to-[#1a1a1a] rounded-xl p-6 border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FaImage className="text-[#50C878]" />
                    Product Image
                  </h3>

                  <div className="space-y-4">
                    {image && (
                      <div className="text-center">
                        <img
                          src={image}
                          alt="Product preview"
                          className="block mx-auto w-full max-w-md h-64 object-cover rounded-lg border border-gray-600"
                        />
                      </div>
                    )}

                    <div className="relative">
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
                        className={`block w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200 ${
                          errors.image
                            ? "border-red-500 bg-red-900/20 hover:bg-red-900/30"
                            : "border-gray-600 bg-[#101011] hover:border-[#50C878] hover:bg-[#101011]/80"
                        }`}
                      >
                        <div className="space-y-2">
                          <FaUpload className="mx-auto text-3xl text-gray-400" />
                          <p className="text-gray-300 font-medium">
                            {image ? "Change Image" : "Click to upload image"}
                          </p>
                          <p className="text-sm text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      </label>
                    </div>

                    {errors.image && (
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <FaTimes className="text-xs" />
                        {errors.image}
                      </p>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="bg-gradient-to-br from-[#101011] to-[#1a1a1a] rounded-xl p-6 border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FaBox className="text-[#50C878]" />
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-white font-semibold mb-2 flex items-center gap-2"
                      >
                        <FaBox className="text-[#50C878]" />
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.name
                            ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                            : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                        } text-white placeholder-gray-400`}
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          clearError("name");
                        }}
                        placeholder="Enter product name"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                          <FaTimes className="text-xs" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="brand"
                        className="block text-white font-semibold mb-2 flex items-center gap-2"
                      >
                        <FaBuilding className="text-[#50C878]" />
                        Brand
                      </label>
                      <input
                        type="text"
                        id="brand"
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.brand
                            ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                            : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                        } text-white placeholder-gray-400`}
                        value={brand}
                        onChange={(e) => {
                          setBrand(e.target.value);
                          clearError("brand");
                        }}
                        placeholder="Enter brand name"
                      />
                      {errors.brand && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                          <FaTimes className="text-xs" />
                          {errors.brand}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="description"
                      className="block text-white font-semibold mb-2 flex items-center gap-2"
                    >
                      <FaBox className="text-[#50C878]" />
                      Description
                    </label>
                    <textarea
                      id="description"
                      className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.description
                          ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                          : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                      } text-white placeholder-gray-400`}
                      rows="4"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        clearError("description");
                      }}
                      placeholder="Enter product description"
                    />
                    {errors.description && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                        <FaTimes className="text-xs" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="bg-gradient-to-br from-[#101011] to-[#1a1a1a] rounded-xl p-6 border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FaDollarSign className="text-[#50C878]" />
                    Pricing & Inventory
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-white font-semibold mb-2 flex items-center gap-2"
                      >
                        <FaDollarSign className="text-[#50C878]" />
                        Price
                      </label>
                      <input
                        type="number"
                        id="price"
                        step="0.01"
                        min="0"
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.price
                            ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                            : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                        } text-white placeholder-gray-400`}
                        value={price}
                        onChange={(e) => {
                          setPrice(e.target.value);
                          clearError("price");
                        }}
                        placeholder="0.00"
                      />
                      {errors.price && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                          <FaTimes className="text-xs" />
                          {errors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="quantity"
                        className="block text-white font-semibold mb-2 flex items-center gap-2"
                      >
                        <FaBox className="text-[#50C878]" />
                        Quantity
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        min="1"
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.quantity
                            ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                            : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                        } text-white placeholder-gray-400`}
                        value={quantity}
                        onChange={(e) => {
                          setQuantity(e.target.value);
                          clearError("quantity");
                        }}
                        placeholder="Enter quantity"
                      />
                      {errors.quantity && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                          <FaTimes className="text-xs" />
                          {errors.quantity}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="stock"
                        className="block text-white font-semibold mb-2 flex items-center gap-2"
                      >
                        <FaWarehouse className="text-[#50C878]" />
                        Stock Count
                      </label>
                      <input
                        type="number"
                        id="stock"
                        min="0"
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.stock
                            ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                            : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                        } text-white placeholder-gray-400`}
                        value={stock}
                        onChange={(e) => {
                          setStock(e.target.value);
                          clearError("stock");
                        }}
                        placeholder="Enter stock count"
                      />
                      {errors.stock && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                          <FaTimes className="text-xs" />
                          {errors.stock}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="category"
                      className="block text-white font-semibold mb-2 flex items-center gap-2"
                    >
                      <FaTags className="text-[#50C878]" />
                      Category
                    </label>
                    <select
                      id="category"
                      className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.category
                          ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                          : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                      } text-white`}
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        clearError("category");
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories?.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                        <FaTimes className="text-xs" />
                        {errors.category}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#50C878] text-white rounded-lg hover:bg-[#45a06a] transition-colors font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaSave className="text-lg" />
                        Update Product
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    <FaTrash className="text-lg" />
                    Delete Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
