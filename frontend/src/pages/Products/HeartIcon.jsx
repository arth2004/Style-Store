import { useDispatch, useSelector } from "react-redux";
import {
  addFaouriteToLocalStorage,
  getFavouritesFromLocalStorage,
  removeFavouriteFromLocalStorage,
} from "../../Utils/localstorage";
import {
  addToFavourites,
  removeFromFavourites,
  setFavourites,
} from "../../redux/feauture/favourites/favouriteSlice";
import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites) || [];
  const isFavaorite = favourites.some((p) => p._id === product._id);

  useEffect(() => {
    const favouritesFromLocalStorage = getFavouritesFromLocalStorage();
    dispatch(setFavourites(favouritesFromLocalStorage));
  }, []);

  const toggleFavourites = () => {
    if (isFavaorite) {
      dispatch(removeFromFavourites(product));
      removeFavouriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavourites(product));
      addFaouriteToLocalStorage(product);
    }
  };

  return (
    <div
      className="absolute top-2 right-5 cursor-pointer"
      onClick={toggleFavourites}
    >
      {isFavaorite ? (
        <FaHeart className="text-emerald-300" />
      ) : (
        <FaRegHeart className="text-white" />
      )}
    </div>
  );
};

export default HeartIcon;
