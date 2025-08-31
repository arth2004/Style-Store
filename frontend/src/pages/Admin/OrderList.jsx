import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import { Link } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  FaBox,
  FaUsers,
  FaDollarSign,
  FaTruck,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaShoppingBag,
  FaCheckCircle,
  FaClock,
  FaTimes,
} from "react-icons/fa";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  // Calculate order statistics
  const totalOrders = orders?.length || 0;
  const paidOrders = orders?.filter((order) => order.isPaid).length || 0;
  const deliveredOrders =
    orders?.filter((order) => order.isDelivered).length || 0;
  const pendingOrders = orders?.filter((order) => !order.isPaid).length || 0;
  const totalRevenue =
    orders?.reduce((sum, order) => sum + (order.totalPrice || 0), 0) || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <Message variant="danger">
            {error?.data?.message || error.error}
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
              <FaBox className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              No Orders Yet
            </h2>
            <p className="text-gray-400 mb-6">
              There are no orders in the system yet. Orders will appear here
              once customers start placing them.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FaBox className="text-[#50C878]" />
            Order Management
          </h1>
          <p className="text-gray-400">Manage and track all customer orders</p>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-white">{totalOrders}</p>
              </div>
              <div className="bg-[#50C878]/20 p-3 rounded-lg">
                <FaBox className="text-2xl text-[#50C878]" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Paid Orders</p>
                <p className="text-2xl font-bold text-green-400">
                  {paidOrders}
                </p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <FaCheckCircle className="text-2xl text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold text-yellow-400">
                  {pendingOrders}
                </p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <FaClock className="text-2xl text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Delivered</p>
                <p className="text-2xl font-bold text-blue-400">
                  {deliveredOrders}
                </p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FaTruck className="text-2xl text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-[#50C878]">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="bg-[#50C878]/20 p-3 rounded-lg">
                <FaDollarSign className="text-2xl text-[#50C878]" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Menu and Orders Table */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admin Menu */}
          <div className="absolute">
            <AdminMenu />
          </div>

          {/* Orders Table */}
          <div className="flex-1">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaShoppingBag className="text-[#50C878]" />
                  All Orders ({totalOrders})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#101011] border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                        Order Details
                      </th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center text-gray-300 font-semibold">
                        Total
                      </th>
                      <th className="px-6 py-4 text-center text-gray-300 font-semibold">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-gray-300 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-[#101011] transition-colors"
                      >
                        {/* Order Details */}
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-600">
                              <img
                                src={order.orderItems[0]?.image}
                                alt={order.orderItems[0]?.name || "Product"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm">
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

                        {/* Customer */}
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-gray-400" />
                            <span className="text-white">
                              {order.user ? order.user.username : "Guest"}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            <span className="text-gray-300">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-6 text-center">
                          <span className="text-[#50C878] font-bold text-lg">
                            ${order.totalPrice?.toFixed(2) || "0.00"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-6">
                          <div className="flex flex-col gap-2">
                            {/* Payment Status */}
                            <div className="flex items-center justify-center">
                              {order.isPaid ? (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                                  <FaCheckCircle className="text-xs" />
                                  Paid
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium border border-red-500/30">
                                  <FaClock className="text-xs" />
                                  Pending
                                </span>
                              )}
                            </div>

                            {/* Delivery Status */}
                            <div className="flex items-center justify-center">
                              {order.isDelivered ? (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                                  <FaTruck className="text-xs" />
                                  Delivered
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium border border-yellow-500/30">
                                  <FaClock className="text-xs" />
                                  In Transit
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-6 text-center">
                          <Link to={`/order/${order._id}`}>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#50C878] text-white rounded-lg hover:bg-[#45a06a] transition-colors font-medium">
                              <FaEye className="text-sm" />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
