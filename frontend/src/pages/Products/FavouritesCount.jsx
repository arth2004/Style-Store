import { useSelector } from "react-redux"


const FavouritesCount = () => {
    const favourites = useSelector((state)=>state.favourites)
    const favouriteCount = favourites.length; 
  return (
    <div className="absolute -top-3 -right-3">
      {favouriteCount > 0 && (
        <span className="px-2 py-0.5 text-xs text-white bg-[#50C878] rounded-full">
          {favouriteCount}
        </span>
      )}
    </div>
  )
}

export default FavouritesCount