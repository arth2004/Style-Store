import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
  useGetOrdersQuery,
} from "../../redux/api/orderApiSlice";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import Chart from "react-apexcharts";
import {
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaBoxes,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: sales, isLoading: salesLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: customersLoading } = useGetUsersQuery();
  const { data: orders, isLoading: ordersLoading } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();
  const { data: allOrders } = useGetOrdersQuery();
  const { data: allProducts } = useAllProductsQuery();

  // Navigation handlers
  const handleAddProduct = () => {
    navigate("/admin/productlist");
  };

  const handleViewOrders = () => {
    navigate("/admin/orderlist");
  };

  const handleViewProducts = () => {
    navigate("/admin/allproductslist");
  };

  const handleViewUsers = () => {
    navigate("/admin/userlist");
  };

  const [state, setState] = useState({
    options: {
      chart: {
        type: "area",
        background: "transparent",
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        theme: "dark",
        x: {
          format: "dd MMM yyyy",
        },
      },
      colors: ["#50C878", "#333333"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 100],
        },
      },
      title: {
        text: "Sales Analytics",
        align: "left",
        style: {
          color: "#ffffff",
          fontSize: "18px",
          fontWeight: "600",
        },
      },
      grid: {
        borderColor: "#333333",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      markers: {
        size: 4,
        colors: ["#50C878"],
        strokeColors: "#ffffff",
        strokeWidth: 2,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            color: "#ffffff",
          },
        },
        labels: {
          style: {
            colors: "#ffffff",
          },
        },
      },
      yaxis: {
        title: {
          text: "Sales ($)",
          style: {
            color: "#ffffff",
          },
        },
        labels: {
          style: {
            colors: "#ffffff",
          },
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        labels: {
          colors: "#ffffff",
        },
      },
    },
    series: [
      {
        name: "Daily Sales",
        data: [],
      },
      {
        name: "Cumulative Sales",
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      // Calculate cumulative sales
      let cumulative = 0;
      const cumulativeData = formattedSalesDate.map((item) => {
        cumulative += item.y;
        return cumulative;
      });

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          {
            name: "Daily Sales",
            data: formattedSalesDate.map((item) => item.y),
          },
          { name: "Cumulative Sales", data: cumulativeData },
        ],
      }));
    }
  }, [salesDetail]);

  // Calculate additional metrics
  const totalProducts = allProducts?.length || 0;
  const pendingOrders =
    allOrders?.filter((order) => !order.isDelivered)?.length || 0;
  const completedOrders =
    allOrders?.filter((order) => order.isDelivered)?.length || 0;
  const totalRevenue = sales?.totalSales || 0;
  const totalCustomers = customers?.length || 0;
  const totalOrders = orders?.totalOrders || 0;

  // Debug chart data
  console.log("Chart Debug Info:", {
    salesDetail: salesDetail,
    state: state,
    hasData: salesDetail && salesDetail.length > 0,
  });

  // Calculate growth percentages (mock data for now)
  const salesGrowth = 12.5;
  const customerGrowth = 8.3;
  const orderGrowth = 15.7;

  if (salesLoading || customersLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <AdminMenu />
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Sales Card */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 hover:border-[#50C878] transition-all duration-300 hover:shadow-lg hover:shadow-[#50C878]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Sales</p>
                <p className="text-2xl font-bold text-white">
                  ${totalRevenue.toFixed(2)}
                </p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <FaChartLine className="mr-1" />+{salesGrowth}% from last
                  month
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] p-3 rounded-full">
                <FaDollarSign className="text-white text-xl" />
              </div>
            </div>
          </div>

          {/* Customers Card */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 hover:border-[#50C878] transition-all duration-300 hover:shadow-lg hover:shadow-[#50C878]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-white">
                  {totalCustomers}
                </p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <FaChartLine className="mr-1" />+{customerGrowth}% from last
                  month
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] p-3 rounded-full">
                <FaUsers className="text-white text-xl" />
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 hover:border-[#50C878] transition-all duration-300 hover:shadow-lg hover:shadow-[#50C878]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-white">{totalOrders}</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <FaChartLine className="mr-1" />+{orderGrowth}% from last
                  month
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] p-3 rounded-full">
                <FaShoppingCart className="text-white text-xl" />
              </div>
            </div>
          </div>

          {/* Products Card */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 hover:border-[#50C878] transition-all duration-300 hover:shadow-lg hover:shadow-[#50C878]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-white">{totalProducts}</p>
                <p className="text-blue-400 text-sm flex items-center mt-1">
                  <FaBoxes className="mr-1" />
                  Active inventory
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] p-3 rounded-full">
                <FaBoxes className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Order Status</h3>
              <FaClock className="text-yellow-400 text-xl" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Pending</span>
                <span className="text-yellow-400 font-semibold">
                  {pendingOrders}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Completed</span>
                <span className="text-green-400 font-semibold">
                  {completedOrders}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Quick Actions
              </h3>
              <FaCheckCircle className="text-green-400 text-xl" />
            </div>
            <div className="space-y-2">
              <button
                onClick={handleAddProduct}
                className="w-full bg-[#50C878] text-white py-2 px-4 rounded-lg hover:bg-[#45a06a] transition-colors text-sm"
              >
                Add Product
              </button>
              <button
                onClick={handleViewOrders}
                className="w-full bg-[#333333] text-white py-2 px-4 rounded-lg hover:bg-[#444444] transition-colors text-sm"
              >
                View Orders
              </button>
              <button
                onClick={handleViewProducts}
                className="w-full bg-[#50C878] text-white py-2 px-4 rounded-lg hover:bg-[#45a06a] transition-colors text-sm"
              >
                Product List
              </button>
              <button
                onClick={handleViewUsers}
                className="w-full bg-[#333333] text-white py-2 px-4 rounded-lg hover:bg-[#444444] transition-colors text-sm"
              >
                User List
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Alerts</h3>
              <FaExclamationTriangle className="text-red-400 text-xl" />
            </div>
            <div className="space-y-2">
              {pendingOrders > 0 ? (
                <div className="text-red-400 text-sm">
                  {pendingOrders} orders pending delivery
                </div>
              ) : (
                <div className="text-green-400 text-sm">
                  All orders processed
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 mb-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Sales Analytics
            </h3>
            <p className="text-gray-400 text-sm">
              Track your daily and cumulative sales performance
            </p>
          </div>
          <div className="flex justify-center">
            <Chart
              options={state.options}
              series={state.series}
              type="area"
              width="100%"
              height={400}
            />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Recent Orders
            </h3>
            <p className="text-gray-400 text-sm">
              Monitor and manage your latest orders
            </p>
          </div>
          <OrderList />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
