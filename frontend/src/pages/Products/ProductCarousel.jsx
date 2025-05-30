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
    <div className="mb-4 w-full">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="w-full"
        >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => {
              {/* const normalizedImagePath = image.replace(/\\/g, "/"); */}
              return (
                <div key={_id}>
                  <img
                    src={image}
                    // src={`${backendBaseUrl}${normalizedImagePath}`}
                    alt={name}
                    className="w-full rounded-lg object-cover h-[20rem] sm:h-[25rem] md:h-[30rem]"
                  />
                  <div className="mt-4 flex flex-col md:flex-row justify-between"> {/* Adjusted parent flex for description and details block */}
                    <div className="one md:w-1/2 pr-4"> {/* Allow description to take half width on medium+ screens */}
                      <h2>{name}</h2>
                      <p> $ {price}</p> <br /> <br />
                      <p> {/* Removed w-[25rem] */}
                        {description.substring(0, 170)} ...
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 w-full md:w-1/2 mt-4 sm:mt-0"> {/* Details block takes other half */}
                      <div className="one">
                        <h1 className="flex items-center mb-6">
                          <FaStore className="mr-2 text-white" /> Brand: {brand}
                        </h1>
                        <h1 className="flex items-center mb-6">
                          <FaClock className="mr-2 text-white" /> Added:{" "}
                          {moment(createdAt).fromNow()}
                        </h1>
                        <h1 className="flex items-center mb-6">
                          <FaStar className="mr-2 text-white" /> Reviews:{" "}
                          {numReviews}
                        </h1>
                      </div>

                      <div className="two">
                        <h1 className="flex items-center mb-6">
                          <FaStar className="mr-2 text-white" /> Ratings:{" "}
                          {Math.round(rating)}
                        </h1>
                        <h1 className="flex items-center mb-6">
                          <FaShoppingCart className="mr-2 text-white" />{" "}
                          Quantity: {quantity}
                        </h1>
                        <h1 className="flex items-center mb-6">
                          <FaBox className="mr-2 text-white" /> In Stock:{" "}
                          {countInStock}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
