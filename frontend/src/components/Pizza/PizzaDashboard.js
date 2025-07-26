//This file provides the user with dashboard to view alailable variteis of pizza

import React, { useState, useEffect, useContext } from 'react';
import axios from '../../utils/api';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PizzaDashboard = () => {
  const { user } = useContext(AuthContext);
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const res = await axios.get('/pizza/varieties');
        setPizzas(res.data);
      } catch (err) {
        console.error("Error fetching pizzas", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  const handleVarietyOrder = async (pizza) => {
    if (!user) {
      setMessage("Please login to place an order.");
      return;
    }

    setMessage("Redirecting to payment...");

    try {
      const { data: orderData } = await axios.post("/order/create-order", {
        pizzaDetails: pizza,
        totalPrice: pizza.price,
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Custom Pizza Shop",
        description: "Pizza Order",
        order_id: orderData.id,
        handler: async function (response) {
          await axios.post("/order/confirm", {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            pizzaDetails: pizza,
            totalPrice: pizza.price,
          });
          setMessage("Order placed successfully!");
        },
        prefill: {
          email: user.email,
          name: user.name,
        },
        theme: {
          color: "#F37254",
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
        rzp.on("payment.failed", () => {
          setMessage("Payment failed, try again.");
        });
      } else {
        setMessage("Razorpay SDK not loaded.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Payment error");
      console.error(err);
    }
  };

  if (loading) return <div className="text-center text-white mt-10">Loading pizzas...</div>;

  return (
    <div className="bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Available Pizza Varieties</h2>

      {message && (
        <div className="text-center text-yellow-400 mb-4">{message}</div>
      )}

      {pizzas.length === 0 ? (
        <p className="text-center">No pizzas found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pizzas.map((pizza) => (
            <div key={pizza._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{pizza.name} - ₹{pizza.price}</h3>
              <p className="text-sm text-gray-300 mb-4">{pizza.description}</p>
              <button
                onClick={() => handleVarietyOrder(pizza)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
              >
                Order Now
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link to="/build-pizza">
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-semibold transition">
            Build Your Custom Pizza
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PizzaDashboard;
