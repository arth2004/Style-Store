import { Link, useParams } from "react-router";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import { useSelector } from "react-redux";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaShoppingBag,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaTimes,
  FaTruck,
  FaShieldAlt,
  FaClock,
  FaUser,
  FaEnvelope,
  FaReceipt,
  FaPaypal,
  FaCalendarAlt,
  FaBox,
} from "react-icons/fa";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!loadingPayPal && !errorPayPal && paypal.clientId) {
      const loadingPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPayPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    console.log("OnApprove triggered");

    return actions.order.capture().then(async function (details) {
      console.log("Payment captured:", details);
      try {
        const res = await payOrder({ orderId, details }).unwrap();
        console.log("payOrder response:", res);
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    console.log("createOrder called");
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice.toFixed(2) } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      toast.success("Order marked as delivered");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <Message variant="danger">{error.data.message}</Message>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <Message variant="danger">Order not found</Message>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <FaReceipt className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Order Details
          </h1>
          <p className="text-gray-400 text-lg">Order #{order._id}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Details - Left Side */}
          <div className="flex-1">
            {/* Order Items */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaShoppingBag className="text-[#50C878]" />
                Order Items ({order.orderItems.length})
              </h2>

              {order.orderItems.length === 0 ? (
                <Message variant="danger">Order is Empty</Message>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">
                          Product
                        </th>
                        <th className="px-4 py-3 text-center text-gray-300 font-semibold">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-center text-gray-300 font-semibold">
                          Unit Price
                        </th>
                        <th className="px-4 py-3 text-center text-gray-300 font-semibold">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {order.orderItems.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-[#101011] transition-colors"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                              />
                              <div>
                                <Link
                                  to={`/product/${item.product}`}
                                  className="text-[#50C878] hover:text-[#45a06a] font-semibold transition-colors"
                                >
                                  {item.name}
                                </Link>
                                <p className="text-gray-400 text-sm">
                                  {item.brand}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center text-white">
                            {item.qty}
                          </td>
                          <td className="px-4 py-4 text-center text-white">
                            ${item.price}
                          </td>
                          <td className="px-4 py-4 text-center text-white font-semibold">
                            ${(item.qty * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Order Status */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaBox className="text-[#50C878]" />
                Order Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#101011] rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-3 mb-3">
                    {order.isPaid ? (
                      <FaCheckCircle className="text-2xl text-[#50C878]" />
                    ) : (
                      <FaTimes className="text-2xl text-red-500" />
                    )}
                    <span className="font-semibold text-white">
                      Payment Status
                    </span>
                  </div>
                  {order.isPaid ? (
                    <div className="text-[#50C878]">
                      <p className="font-semibold">Paid</p>
                      <p className="text-sm text-gray-400">
                        {new Date(order.paidAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-red-500 font-semibold">Not Paid</p>
                  )}
                </div>

                <div className="bg-[#101011] rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-3 mb-3">
                    {order.isDelivered ? (
                      <FaCheckCircle className="text-2xl text-[#50C878]" />
                    ) : (
                      <FaTruck className="text-2xl text-yellow-500" />
                    )}
                    <span className="font-semibold text-white">
                      Delivery Status
                    </span>
                  </div>
                  {order.isDelivered ? (
                    <div className="text-[#50C878]">
                      <p className="font-semibold">Delivered</p>
                      <p className="text-sm text-gray-400">
                        {new Date(order.deliveredAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-yellow-500 font-semibold">In Transit</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:w-96">
            {/* Customer Information */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl mb-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaUser className="text-[#50C878]" />
                Customer Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaUser className="text-[#50C878]" />
                  <div>
                    <p className="text-white font-semibold">
                      {order.user.username}
                    </p>
                    <p className="text-gray-400 text-sm">Username</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-[#50C878]" />
                  <div>
                    <p className="text-white font-semibold">
                      {order.user.email}
                    </p>
                    <p className="text-gray-400 text-sm">Email</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl mb-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#50C878]" />
                Shipping Address
              </h3>
              <div className="bg-[#101011] rounded-xl p-4 border border-gray-600">
                <p className="text-white mb-2">
                  <strong>Address:</strong> {order.shippingAddress.address}
                </p>
                <p className="text-white mb-2">
                  <strong>City:</strong> {order.shippingAddress.city}
                </p>
                <p className="text-white mb-2">
                  <strong>Postal Code:</strong>{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-white">
                  <strong>Country:</strong> {order.shippingAddress.country}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl mb-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaCreditCard className="text-[#50C878]" />
                Payment Method
              </h3>
              <div className="bg-[#101011] rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-3">
                  {order.paymentMethod === "PayPal" ? (
                    <FaPaypal className="text-2xl text-[#50C878]" />
                  ) : (
                    <FaCreditCard className="text-2xl text-[#50C878]" />
                  )}
                  <span className="text-white font-semibold">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl mb-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaReceipt className="text-[#50C878]" />
                Order Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Items</span>
                  <span className="text-white font-semibold">
                    ${(Number(order.itemsPrice) || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Shipping</span>
                  <span className="text-white font-semibold">
                    ${(Number(order.shippingPrice) || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Tax</span>
                  <span className="text-white font-semibold">
                    ${(Number(order.taxPrice) || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-t border-gray-600">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-[#50C878] font-bold text-2xl">
                    ${(Number(order.totalPrice) || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            {!order.isPaid && (
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl mb-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FaPaypal className="text-[#50C878]" />
                  Complete Payment
                </h3>
                {loadingPay ? (
                  <div className="text-center py-4">
                    <Loader />
                    <p className="text-gray-400 mt-2">Processing payment...</p>
                  </div>
                ) : isPending ? (
                  <div className="text-center py-4">
                    <Loader />
                    <p className="text-gray-400 mt-2">Loading PayPal...</p>
                  </div>
                ) : (
                  <div className="bg-[#101011] rounded-xl p-4 border border-gray-600">
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Admin Actions */}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaTruck className="text-[#50C878]" />
                    Admin Actions
                  </h3>
                  <button
                    onClick={deliverHandler}
                    type="button"
                    disabled={loadingDeliver}
                    className="w-full bg-gradient-to-r from-[#50C878] to-[#45a06a] hover:from-[#45a06a] hover:to-[#50C878] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loadingDeliver ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaTruck />
                        Mark As Delivered
                      </>
                    )}
                  </button>
                </div>
              )}

            {/* Trust Indicators */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaShieldAlt className="text-[#50C878]" />
                Order Protection
              </h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-[#50C878]" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTruck className="text-[#50C878]" />
                  <span>Tracked Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-[#50C878]" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
