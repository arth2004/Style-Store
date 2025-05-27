import { useSelector } from "react-redux";
import Product from "./Product";
import { selectFavouriteProduct } from "../../redux/feauture/favourites/favouriteSlice";

const Favourites = () => {
  const favourites = useSelector(selectFavouriteProduct);
  return (
    <div className="flex flex-col">
      <h1 className="text-lg font-bold px-3">
        FAVORITE PRODUCTS
      </h1>

      <div className="flex flex-wrap">
        {favourites.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Favourites;
