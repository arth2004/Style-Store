import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import backendBaseUrl from "../../config";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("image", image);
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
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Try Again.");
    }
  };

    const uploadFileHandler = async (e) => {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      try {
        const res = await uploadProductImage(formData).unwrap();
        toast.success(res.message);
        const fullImageUrl = `${backendBaseUrl}${res.image}`;
        setImage(res.image);
        setImageUrl(fullImageUrl);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    };

  return (
    <div className="container sm:mx-[0] p-4">
      <div className="flex flex-col md:flex-row">
      <AdminMenu />
        <div className="md:w-3/4 p-3">
          <h2 className="text-xl font-bold mb-4">Create Product</h2>

          {imageUrl && (
            <div className="text-center mb-4">
              <img
                src={`${backendBaseUrl}${imageUrl.replace(/\\/g, "/")}`}
                alt="product"
                className="block mx-auto max-h-[200px] rounded-lg"
              />
            </div>
          )}

          <div className="mb-3">
              <label className="text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-6">
                {image ? image.name : "Upload Image "}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer text-blue-500 font-semibold">
                  {image ? "Change Image" : "Click to Upload"}
                </label>
              </label>
            </div>

          <div className="p-4">
            <div className="flex flex-wrap mb-4">
              <div className="w-full md:w-1/2 pr-2">
                <label htmlFor="name" className="block text-white mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/2 pl-2">
                <label htmlFor="price" className="block text-white mb-2">
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap mb-4">
              <div className="w-full md:w-1/2 pr-2">
                <label htmlFor="quantity" className="block text-white mb-2">
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/2 pl-2">
                <label htmlFor="brand" className="block text-white mb-2">
                  Brand
                </label>
                <input
                  id="brand"
                  type="text"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-white mb-2">
                Description
              </label>
              <textarea
                id="description"
                className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-between mb-4">
              <div className="w-full md:w-1/2 pr-2">
                <label htmlFor="stock" className="block text-white mb-2">
                  Count In Stock
                </label>
                <input
                  id="stock"
                  type="number"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="w-full md:w-1/2 pl-2">
                <label htmlFor="category" className="block text-white mb-2">
                  Category
                </label>
                <select
                  id="category"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="py-4 px-10 mt-5 w-full rounded-lg text-lg font-bold bg-pink-600"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
