import { Link } from "react-router";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaShoppingBag,
  FaCalendarAlt,
  FaDollarSign,
  FaCheckCircle,
  FaTimes,
  FaTruck,
  FaEye,
  FaReceipt,
  FaClock,
  FaBox,
} from "react-icons/fa";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

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
          <Message variant="danger">
            {error?.data?.error || error.error}
          </Message>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FaShoppingBag className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              No Orders Yet
            </h2>
            <p className="text-gray-400 mb-6">
              You haven't placed any orders yet. Start shopping to see your
              order history here.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-[#50C878] text-white px-6 py-3 rounded-lg hover:bg-[#45a06a] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
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
            My Orders
          </h1>
          <p className="text-gray-400 text-lg">
            Track your order history and delivery status
          </p>
        </div>

        {/* Orders Table */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="px-4 py-4 text-left text-gray-300 font-semibold">
                    Order
                  </th>
                  <th className="px-4 py-4 text-left text-gray-300 font-semibold">
                    Date
                  </th>
                  <th className="px-4 py-4 text-center text-gray-300 font-semibold">
                    Total
                  </th>
                  <th className="px-4 py-4 text-center text-gray-300 font-semibold">
                    Payment
                  </th>
                  <th className="px-4 py-4 text-center text-gray-300 font-semibold">
                    Delivery
                  </th>
                  <th className="px-4 py-4 text-center text-gray-300 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-[#101011] transition-colors"
                  >
                    {/* Order Info */}
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={order.orderItems[0]?.image}
                          alt={order.orderItems[0]?.name || "Product"}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                        />
                        <div>
                          <p className="text-white font-semibold">
                            #{order._id ? order._id.slice(-8) : "N/A"}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {order.orderItems.length} item
                            {order.orderItems.length !== 1 ? "s" : ""}
                          </p>
                          <p className="text-[#50C878] text-sm font-medium">
                            {order.orderItems[0]?.name || "Product"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#50C878]" />
                        <div>
                          <p className="text-white font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-4 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <FaDollarSign className="text-[#50C878]" />
                        <span className="text-white font-bold text-lg">
                          {Number(order.totalPrice).toFixed(2)}
                        </span>
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="px-4 py-6 text-center">
                      {order.isPaid ? (
                        <div className="inline-flex items-center gap-2 bg-green-900/20 border border-green-500 text-green-400 px-3 py-2 rounded-full">
                          <FaCheckCircle className="text-green-400" />
                          <span className="font-medium">Paid</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 bg-red-900/20 border border-red-500 text-red-400 px-3 py-2 rounded-full">
                          <FaTimes className="text-red-400" />
                          <span className="font-medium">Pending</span>
                        </div>
                      )}
                    </td>

                    {/* Delivery Status */}
                    <td className="px-4 py-6 text-center">
                      {order.isDelivered ? (
                        <div className="inline-flex items-center gap-2 bg-green-900/20 border border-green-500 text-green-400 px-3 py-2 rounded-full">
                          <FaCheckCircle className="text-green-400" />
                          <span className="font-medium">Delivered</span>
                        </div>
                      ) : order.isPaid ? (
                        <div className="inline-flex items-center gap-2 bg-yellow-900/20 border border-yellow-500 text-yellow-400 px-3 py-2 rounded-full">
                          <FaTruck className="text-yellow-400" />
                          <span className="font-medium">In Transit</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 bg-gray-900/20 border border-gray-500 text-gray-400 px-3 py-2 rounded-full">
                          <FaClock className="text-gray-400" />
                          <span className="font-medium">Waiting</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-6 text-center">
                      <Link to={`/order/${order._id}`}>
                        <button className="bg-gradient-to-r from-[#50C878] to-[#45a06a] hover:from-[#45a06a] hover:to-[#50C878] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto">
                          <FaEye />
                          View Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl text-center">
            <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaReceipt className="text-2xl text-white" />
            </div>
            <h3 className="text-white font-bold text-2xl mb-2">
              {orders.length}
            </h3>
            <p className="text-gray-400">Total Orders</p>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl text-center">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaCheckCircle className="text-2xl text-white" />
            </div>
            <h3 className="text-white font-bold text-2xl mb-2">
              {orders.filter((order) => order.isPaid).length}
            </h3>
            <p className="text-gray-400">Paid Orders</p>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl text-center">
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaTruck className="text-2xl text-white" />
            </div>
            <h3 className="text-white font-bold text-2xl mb-2">
              {
                orders.filter((order) => order.isPaid && !order.isDelivered)
                  .length
              }
            </h3>
            <p className="text-gray-400">In Transit</p>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl text-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaBox className="text-2xl text-white" />
            </div>
            <h3 className="text-white font-bold text-2xl mb-2">
              {orders.filter((order) => order.isDelivered).length}
            </h3>
            <p className="text-gray-400">Delivered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrder;
