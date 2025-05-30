import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import backendBaseUrl from "../../config";
// import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  const normalizedImagePath = product.image.replace(/\\/g, "/");
  return (
    <div className="w-[19rem] p-3 relative">
      <div className="relative">
        <img
          // src={`${backendBaseUrl}${normalizedImagePath}`}
          src={product.image}
          alt={product.name}
          className="h-auto rounded"
        />
        {/* {console.log(`${backendBaseUrl}${normalizedImagePath}`)} */}
        <HeartIcon product={product} />
      </div>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div>{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              ${product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
