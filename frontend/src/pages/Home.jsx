import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Header from "../components/Header";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {/* Only show Header when there’s no search keyword */}
      {!keyword && <Header />}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <>
          {/* Wrap in a container with horizontal padding */}
          <div className="container mx-auto px-4 mt-8">
            {/* 
              On phones: stack vertically (flex-col), center both items.
              At md (≥768px): switch to flex-row, justify-between.
            */}
            <div className="flex flex-col items-center gap-4 justify-center">
              <h1 className="text-2xl md:text-4xl font-bold text-center md:text-left">
                Special Products
              </h1>

              <Link
                to="/shop"
                className="
                  bg-pink-600 
                  text-white 
                  font-semibold 
                  rounded-full 
                  py-2 px-6 
                  text-sm md:text-base 
                  hover:bg-pink-700 
                  transition
                "
              >
                Shop
              </Link>
            </div>

            {/* 
              Products grid:
              - On mobile: one column (w-full), with some vertical margin.
              - At sm (≥640px): two columns.
              - At lg (≥1024px): three columns.
              - Centered, with gaps.
            */}
            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {data.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
