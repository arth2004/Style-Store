import ProductCarousel from "../pages/Products/ProductCarousel";
import SmallProduct from "../pages/Products/SmallProducts";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-around items-center lg:items-start gap-5 p-4">
        <div className="w-full lg:w-1/2 xl:w-1/3 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {data.map((product) => (
              <div key={product._id}>
                <SmallProduct product={product} />
              </div>
            ))}
        </div>
        <ProductCarousel />
      </div>
    </>
  );
};

export default Header;