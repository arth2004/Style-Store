import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { FaUpload, FaImage, FaSave, FaTimes, FaPlus } from "react-icons/fa";
// import backendBaseUrl from "../../config";

const ProductList = () => {
  const [imageFile, setImageFile] = useState(null); // For showing file name
  const [image, setImage] = useState(""); // Will hold Cloudinary URL
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = "Product name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!price || price <= 0) newErrors.price = "Valid price is required";
    if (!category) newErrors.category = "Category is required";
    if (!quantity || quantity <= 0) newErrors.quantity = "Valid quantity is required";
    if (!brand.trim()) newErrors.brand = "Brand is required";
    if (stock < 0) newErrors.stock = "Stock cannot be negative";
    if (!image) newErrors.image = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = new FormData();
      productData.append("image", image); // This is the Cloudinary URL
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed. Try Again.");
      } else {
        toast.success(`${data.name} is created successfully!`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Try Again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully!");
      setImage(res.image); // Cloudinary URL
      setImageUrl(res.image); // Directly usable
      setErrors(prev => ({ ...prev, image: null })); // Clear image error
    } catch (error) {
      toast.error(error?.data?.message || "Image upload failed");
    }
  };

  const clearForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setQuantity("");
    setBrand("");
    setStock(0);
    setImage("");
    setImageUrl(null);
    setImageFile(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminMenu />
          
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <FaPlus className="text-[#50C878]" />
                Create New Product
              </h1>
              <p className="text-gray-400 text-lg">
                Add a new product to your inventory with all the necessary details
              </p>
            </div>

            {/* Main Form */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-8 border border-gray-700 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <FaImage className="text-[#50C878]" />
                    Product Image
                  </h3>
                  
                  {imageUrl && (
                    <div className="text-center">
                      <img
                        src={imageUrl}
                        alt="Product preview"
                        className="max-h-48 rounded-lg border-2 border-[#50C878] shadow-lg"
                      />
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-[#50C878] transition-colors">
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
                      className="cursor-pointer flex flex-col items-center gap-3"
                    >
                      <FaUpload className="text-3xl text-gray-400" />
                      <div>
                        <p className="text-white font-medium">
                          {imageFile ? imageFile.name : "Click to upload image"}
                        </p>
                        <p className="text-sm text-gray-400">
                          {imageFile ? "Click to change" : "PNG, JPG up to 5MB"}
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  {errors.image && (
                    <p className="text-red-400 text-sm">{errors.image}</p>
                  )}
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white font-medium mb-2">
                      Product Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={`w-full p-4 rounded-lg border transition-colors ${
                        errors.name 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-600 bg-[#101011] hover:border-gray-500 focus:border-[#50C878]'
                      } text-white`}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                      }}
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-white font-medium mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        className={`w-full p-4 pl-8 rounded-lg border transition-colors ${
                          errors.price 
                            ? 'border-red-500 bg-red-900/20' 
                            : 'border-gray-600 bg-[#101011] hover:border-gray-500 focus:border-[#50C878]'
                        } text-white`}
                        value={price}
                        onChange={(e) => {
                          setPrice(e.target.value);
                          if (errors.price) setErrors(prev => ({ ...prev, price: null }));
                        }}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-400 text-sm mt-1">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="brand" className="block text-white font-medium mb-2">
                      Brand *
                    </label>
                    <input
                      id="brand"
                      type="text"
                      className={`w-full p-4 rounded-lg border transition-colors ${
                        errors.brand 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-600 bg-[#101011] hover:border-gray-500 focus:border-[#50C878]'
                      } text-white`}
                      value={brand}
                      onChange={(e) => {
                        setBrand(e.target.value);
                        if (errors.brand) setErrors(prev => ({ ...prev, brand: null }));
                      }}
                      placeholder="Enter brand name"
                    />
                    {errors.brand && (
                      <p className="text-red-400 text-sm mt-1">{errors.brand}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-white font-medium mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      className={`w-full p-4 rounded-lg border transition-colors ${
                        errors.category 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-600 bg-[#101011] hover:border-gray-500 focus:border-[#50C878]'
                      } text-white`}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        if (errors.category) setErrors(prev => ({ ...prev, category: null }));
                      }}
                      value={category}
                    >
                      <option value="">Select a category</option>
                      {categories?.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-400 text-sm mt-1">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-white font-medium mb-2">
                      Quantity *
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      className={`w-full p-4 rounded-lg border transition-colors ${
                        errors.quantity 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-600 bg-[#101011] hover:border-gray-500 focus:border-[#50C878]'
                      } text-white`}
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                        if (errors.quantity) setErrors(prev => ({ ...prev, quantity: null }));
                      }}
                      placeholder="Enter quantity"
                    />
                    {errors.quantity && (
                      <p className="text-red-400 text-sm mt-1">{errors.quantity}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="stock" className="block text-white font-medium mb-2">
                      Stock Count
                    </label>
                    <input
                      id="stock"
                      type="number"
                      min="0"
                      className={`w-full p-4 rounded-lg border transition-colors ${
                        errors.stock 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-600 bg-[#101011] hover:border-gray-500 focus:border-[#50C878]'
                      } text-white`}
                      value={stock}
                      onChange={(e) => {
                        setStock(e.target.value);
                        if (errors.stock) setErrors(prev => ({ ...prev, stock: null }));
                      }}
                      placeholder="Enter stock count"
                    />
                    {errors.stock && (
                      <p className="text-red-400 text-sm mt-1">{errors.stock}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-white font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    className={`w-full p-4 rounded-lg border transition-colors ${
                      errors.description 
                        ? 'border-red-500 bg-red-900/20' 
                        : 'border-gray-600 bg-[#101011] hover:border-gray-500 focus:border-[#50C878]'
                    } text-white resize-none`}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (errors.description) setErrors(prev => ({ ...prev, description: null }));
                    }}
                    placeholder="Enter product description..."
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-[#50C878] to-[#45a06a] text-white font-bold py-4 px-8 rounded-lg hover:from-[#45a06a] hover:to-[#50C878] transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Creating Product...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Create Product
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-8 py-4 border-2 border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-[#50C878] hover:text-[#50C878] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaTimes />
                    Clear Form
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

export default ProductList;
