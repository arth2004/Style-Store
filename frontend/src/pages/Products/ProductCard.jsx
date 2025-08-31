import { useDispatch } from "react-redux";
import { Link } from "react-router";
import HeartIcon from "./HeartIcon";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { addToCart } from "../../redux/feauture/cart/cartSlice";
import { toast } from "react-toastify";
import backendBaseUrl from "../../config";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully");
  };

  return (
    <div className="group bg-[#333333] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-[#333333] hover:border-[#50C878] h-full flex flex-col">
      {/* Image Section */}
      <section className="relative overflow-hidden bg-gray-900">
        <Link to={`/product/${p._id}`}>
          {/* Brand Badge */}
          <span className="absolute top-3 left-3 bg-green-400  text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-lg">
            {p?.brand}
          </span>

          {/* Product Image */}
          <div className="aspect-square overflow-hidden">
            <img
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
              src={p.image}
              alt={p.name}
            />
          </div>
        </Link>

        {/* Heart Icon */}
        <div className="absolute top-3 right-3 z-10">
          <HeartIcon product={p} />
        </div>
      </section>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Product Name and Price */}
        <div className="mb-3 flex-1">
          <h5 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#50C878] transition-colors duration-200 min-h-[3.5rem]">
            {p?.name}
          </h5>
          <p className="text-2xl font-bold text-green mb-3">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        {/* Description */}
        <p className="text-[#F5F5F5] text-sm mb-4 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {p?.description?.substring(0, 80)}...
        </p>

        {/* Action Buttons */}
        <section className="flex justify-between items-center mt-auto">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#50C878] rounded-lg  focus:ring-4 focus:outline-none focus:ring-[#50C878] transition-all duration-200 hover:scale-105 shadow-lg flex-1 mr-3 justify-center"
          >
            View Details
            <svg
              className="w-4 h-4 ml-2"
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

          <button
            onClick={() => addToCartHandler(p, 1)}
            className="p-3 bg-[#333333] hover:bg-[#50C878] text-[#F5F5F5] hover:text-white rounded-lg cursor-pointer transition-all duration-200 hover:scale-110 shadow-lg group-hover:bg-[#50C878] group-hover:text-white flex-shrink-0"
            title="Add to Cart"
          >
            <AiOutlineShoppingCart size={20} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
