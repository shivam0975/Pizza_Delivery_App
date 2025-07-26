// This file contains the main admin dashboeard for managing inventory and orders

import React, { useEffect, useState, useContext } from "react";
import axios from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { io } from "socket.io-client";

const statusColors = {
  "Order Received": "#3498db",
  "In Kitchen": "#f1c40f",
  "Sent to Delivery": "#2ecc71",
};

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [inventory, setInventory] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [stockUpdatingId, setStockUpdatingId] = useState(null);
  const [stockUpdatingQty, setStockUpdatingQty] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, ordersRes] = await Promise.all([
          axios.get("/admin/inventory"),
          axios.get("/admin/orders"),
        ]);
        setInventory(invRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const s = io("http://localhost:8080/admin");
    setSocket(s);

    s.on("newOrder", (newOrder) => {
      setOrders((orders) => [newOrder, ...orders]);
    });

    s.on("stockUpdated", (updatedInventory) => {
      setInventory(updatedInventory);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const handleStockChange = (id, val) => {
    setStockUpdatingId(id);
    setStockUpdatingQty(val);
  };

  const updateStock = async (id) => {
    try {
      await axios.put(`/admin/inventory/${id}`, {
        quantity: Number(stockUpdatingQty),
      });
      const res = await axios.get("/admin/inventory");
      setInventory(res.data);
      setStockUpdatingId(null);
      setStockUpdatingQty(null);
    } catch (err) {
      alert("Error updating stock");
      console.error(err);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/admin/orders/${orderId}/status`, { status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      alert("Error updating order status.");
      console.error(err);
    }
  };

  if (loading)
    return <p className="text-center text-white">Loading admin data...</p>;

  return (
    <div className="bg-gray-900 text-white min-h-screen py-10 px-6 max-w-6xl mx-auto overflow-visible">
      <h2 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h2>

      {/* Inventory Section */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-6">
          Inventory Management
        </h3>
        {Object.entries(inventory).map(([type, items]) => (
          <div key={type} className="mb-10">
            <h4 className="text-lg font-medium mb-4 uppercase">{type}</h4>
            <div className="overflow-x-auto">
              <table className="table-fixed w-full bg-gray-800 border border-gray-600 rounded-md">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="w-1/4 py-2 px-3 border-b border-gray-600">
                      Item Name
                    </th>
                    <th className="w-1/4 py-2 px-3 border-b border-gray-600">
                      Quantity
                    </th>
                    <th className="w-1/4 py-2 px-3 border-b border-gray-600">
                      Price
                    </th>
                    <th className="w-1/4 py-2 px-3 border-b border-gray-600">
                      Update Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} className="text-sm">
                      <td className="py-2 px-3 border-b border-gray-700">
                        {item.itemName}
                      </td>
                      <td className="py-2 px-3 border-b border-gray-700">
                        {item.quantity}
                      </td>
                      <td className="py-2 px-3 border-b border-gray-700">
                        ₹{item.price}
                      </td>
                      <td className="py-2 px-3 border-b border-gray-700">
                        {stockUpdatingId === item._id ? (
                          <>
                            <input
                              type="number"
                              value={stockUpdatingQty}
                              onChange={(e) =>
                                handleStockChange(item._id, e.target.value)
                              }
                              min={0}
                              className="w-20 mr-2 px-2 py-1 text-black rounded"
                            />
                            <button
                              onClick={() => updateStock(item._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-2"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setStockUpdatingId(null)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              handleStockChange(item._id, item.quantity)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      {/* Orders Section */}
      <section>
        <h3 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-6">
          Order Management
        </h3>

        {orders.length === 0 ? (
          <p className="text-center text-gray-400">No orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-800 rounded-lg p-5 border border-gray-700 shadow-md flex flex-col justify-between"
              >
                <div className="mb-4 space-y-2 text-sm">
                  <div>
                    <strong className="text-gray-300">Order ID:</strong>{" "}
                    {order._id}
                  </div>
                  <div>
                    <strong className="text-gray-300">User:</strong>{" "}
                    {order.user?.name} ({order.user?.email})
                  </div>
                  <div>
                    <strong className="text-gray-300">Total Price:</strong> ₹
                    {order.totalPrice}
                  </div>
                  <div>
                    <strong className="text-gray-300">Status:</strong>
                    <span
                      className="ml-2 px-2 py-0.5 rounded text-white font-medium"
                      style={{
                        backgroundColor:
                          statusColors[order.status] || "#636e72",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4 text-sm">
                  <strong className="text-gray-300">Pizza:</strong> Base:{" "}
                  {order.pizzaDetails.base}, Sauce: {order.pizzaDetails.sauce},
                  Cheese: {order.pizzaDetails.cheese}, Veggies:{" "}
                  {order.pizzaDetails.veggies.join(", ") || "None"}, Meat:{" "}
                  {order.pizzaDetails.meat.join(", ") || "None"}
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {["Order Received", "In Kitchen", "Sent to Delivery"].map(
                    (status) => (
                      <button
                        key={status}
                        disabled={order.status === status}
                        onClick={() => updateOrderStatus(order._id, status)}
                        className={`px-3 py-1 rounded text-white text-sm transition ${
                          order.status === status
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:scale-105"
                        }`}
                        style={{
                          backgroundColor: statusColors[status] || "#636e72",
                        }}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
