import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import backendBaseUrl from "../../config";

const Product = ({ product }) => {
  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-3 mx-auto">
      <div className="relative w-full overflow-hidden rounded">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-auto object-cover rounded transition-transform duration-300 hover:scale-105"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center text-base sm:text-lg">
            <div className="text-gray-800 font-semibold">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              $ {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};


export default Product;
