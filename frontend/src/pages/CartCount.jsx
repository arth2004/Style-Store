import { useSelector } from "react-redux";

const CartCount = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);
  return (
    <div className="absolute -top-3 -right-3">
      {cartCount > 0 && (
        <span className="px-2 py-0.5 text-xs text-white bg-[#50C878] rounded-full">
          {cartCount}
        </span>
      )}
    </div>
  );
};

export default CartCount;
