import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart, removeFromCart } from "../redux/feauture/cart/cartSlice";
import { FaTrash } from "react-icons/fa";
import backendBaseUrl from "../config";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addtoCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <div className="container flex  items-start flex-wrap ">
        {cartItems.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-screen w-full">
            <div className="text-3xl ">Your cart is empty!!</div>
            <div>
              <Link to="/shop" className="text-xl font-bold">
                GO TO SHOP
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-[80%]">
              <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
              {cartItems.map((item) =>  (
                <div key={item._id} className="flex  pb-2 mb-[1rem]">
                  <div className="min-w-[5rem] w-[5rem] h-[5rem] sm:w-[6rem] sm:h-[6rem]">
                    <img
                      // src={`${backendBaseUrl}${item.image.replace(/\\/g, "/")}`}
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 ml-4 ">
                    <Link to={`/product/${item._id}`} className="text-pink-500">
                      {item.name}
                    </Link>
                    <div className="mt-2 text-white">{item.brand}</div>
                    <div className="mt-2 text-white font-bold">
                      ${item.price}
                    </div>
                  </div>
                  <div className="w-24">
                    <select
                      className="w-full p-1 border rounded text-white bg-pink-600"
                      value={item.qty}
                      onChange={(e) =>
                        addtoCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock || 0).keys()].map((x) => (
                        <option value={x + 1} key={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <button
                      className="text-red-500 mr-[5rem]"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash className="ml-[1rem] mt-[.5rem] cursor-pointer" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-8 w-[40rem]">
                <div className="p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>
                  <div className="text-2xl font-bold">
                    ${" "}
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </div>
                  <button
                    className="bg-pink-500 mt-4 py-2 px-4 rounded-full text-lg w-full cursor-pointer"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed to checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
