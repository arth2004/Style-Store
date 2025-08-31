import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import backendBaseUrl from "../../config";
// import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  // const normalizedImagePath = product.image.replace(/\\/g, "/");
  return (
    <div className="w-full p-3 shadow-sm rounded-lg bg-[#1A1A1A] border border-gray-700">
      <div className="relative">
        {/* 
          Fixed dimensions for consistent sizing
          Use aspect-square for consistent image proportions
        */}
        <div className="aspect-square w-full overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-200"
          />
        </div>
        <HeartIcon product={product} />
      </div>
      <div className="mt-3">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center text-sm font-semibold text-white">
            <span className="truncate flex-1 mr-2">{product.name}</span>
            <span className="bg-emerald-500 text-[#333333] text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
              ${product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
