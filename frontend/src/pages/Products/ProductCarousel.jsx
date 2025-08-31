import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import Message from "../../components/Message";
import backendBaseUrl from "../../config";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      <Slider {...settings}>
        {products.map((prod) => (
          <div key={prod._id} className="p-2">
            {/* 
              The parent container has padding-x 2 ( = 0.5rem) so the slide doesn’t touch edges.
            */}
            <div className="w-full rounded-lg shadow-md overflow-hidden ">
              {/* 
                Responsive image height:
                - h-48 (192px) on mobile
                - at md: h-64 (256px)
                - at lg: h-80 (320px)
                - full width always
                - object-cover to crop nicely
              */}
              <img
                src={prod.image}
                alt={prod.name}
                className="w-full md:h-64 lg:h-[30rem] object-cover"
              />

              <div className="p-4 space-y-4 text-gray-100">
                <div>
                  <h2 className="text-lg font-semibold">{prod.name}</h2>
                  <p className="text-emerald-500 font-bold mt-1">${prod.price}</p>
                </div>

                <p className="text-sm text-[#F5F5F5] line-clamp-3">
                  {prod.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-100">
                  {/* LEFT COLUMN */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaStore className="mr-2 text-gray-100" /> Brand:{" "}
                      <span className="font-medium">{prod.brand}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-2 text-gray-100" /> Added:{" "}
                      <span className="font-medium">
                        {moment(prod.createdAt).fromNow()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="mr-2 text-gray-100" /> Reviews:{" "}
                      <span className="font-medium">{prod.numReviews}</span>
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaStar className="mr-2 text-gray-100" /> Ratings:{" "}
                      <span className="font-medium">
                        {Math.round(prod.rating)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaShoppingCart className="mr-2 text-gray-100" /> Qty:{" "}
                      <span className="font-medium">{prod.quantity}</span>
                    </div>
                    <div className="flex items-center">
                      <FaBox className="mr-2 text-gray-100" /> In Stock:{" "}
                      <span className="font-medium">{prod.countInStock}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
