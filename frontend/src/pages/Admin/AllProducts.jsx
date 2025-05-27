import React from "react";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import moment from "moment";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <div>Error Loading Products</div>;
  }
  return (
    <div className="container mx-[9rem]">
      <div className="md:w-1/4 p-3 mt-2">
        <AdminMenu />
      </div>
  
      <div className="flex flex-col md:flex-row">
        <div className="py-3 w-full">
          <div className="ml-[2rem] text-xl font-bold h-12">
            All Products ({products.length})
          </div>
  
          <div className="flex flex-wrap justify-between items-start">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/admin/product/update/${product._id}`}
                className="block mb-6 w-full md:w-[48%] xl:w-[48%] overflow-hidden"
              >
                <div className="flex gap-4 p-3  hover:shadow-md transition-all">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-[10rem] h-[8rem] object-cover rounded-md"
                  />
  
                  <div className="flex flex-col justify-between w-full">
                    <div className="flex justify-between items-center">
                      <h5 className="text-lg font-semibold">{product.name}</h5>
                      <p className="text-gray-400 text-sm">
                        {moment(product.createdAt).format("MMMM DD YYYY")}
                      </p>
                    </div>
  
                    <p className="text-gray-500 text-sm mb-3">
                      {product?.description?.substring(0, 160)}...
                    </p>
  
                    <div className="flex justify-between items-center">
                      <Link
                        to={`/admin/product/update/${product._id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:ring-pink-300"
                      >
                        Update Product
                        <svg
                          className="w-3.5 h-3.5 ml-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </Link>
                      <p className="font-semibold text-gray-700">${product?.price}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default AllProducts;
