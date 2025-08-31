import ProductCarousel from "../pages/Products/ProductCarousel";
import SmallProduct from "../pages/Products/SmallProducts";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (error) {
    return <h1>ERROR</h1>;
  }

  // Don't render anything while loading, let parent handle the loader
  if (isLoading || !data) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 ">
      {/* 
        Mobile-first: flex-col by default. At md: switch to flex-row. 
        items-center on mobile; items-start at md & above. 
      */}
      <div className="flex flex-col md:flex-row items-stretch justify-around gap-6">
        {/* 
          Product grid wrapper:
          - w-full on mobile
          - at lg: limit to 50% (w-1/2); at xl: w-1/3
          - Use grid-cols-1 on mobile, grid-cols-2 at sm (≥640px)
        */}
        <div className="w-full lg:w-1/2  grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map((product) => (
            <SmallProduct key={product._id} product={product} />
          ))}
        </div>

        {/* 
          Carousel wrapper:
          - w-full on mobile
          - at lg: w-1/2
          - remove all fixed px/rem margins / widths
          - add top margin on mobile (mt-6) so it's not glued to the grid
        */}
        <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
          <ProductCarousel />
        </div>
      </div>
    </div>
  );
};

export default Header;
