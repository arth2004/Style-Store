import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import backendBaseUrl from "../../config";
// import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  // const normalizedImagePath = product.image.replace(/\\/g, "/");
  return (
    <div className="w-full p-3 shadow-sm rounded-lg">
      <div className="relative">
        {/* 
          Make image full-width, auto height. 
          Use object-cover so it fills the container. 
        */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-auto object-cover rounded-lg"
        />
        <HeartIcon product={product} />
      </div>
      <div className="mt-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center text-sm sm:text-base font-semibold">
            <span className="truncate">{product.name}</span>
            <span className="bg-pink-100 text-pink-800 text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full">
              ${product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
