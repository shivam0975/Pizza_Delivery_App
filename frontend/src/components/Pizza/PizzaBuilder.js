//This fiele allow user to build their custom pizza

import React, { useState, useEffect, useContext } from "react";
import axios from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

const PizzaBuilder = () => {
  const { user } = useContext(AuthContext);

  const [inventory, setInventory] = useState({
    base: [],
    sauce: [],
    cheese: [],
    veggies: [],
    meat: [],
  });

  const [selection, setSelection] = useState({
    base: "",
    sauce: "",
    cheese: "",
    veggies: [],
    meat: [],
  });

  const [price, setPrice] = useState(0);
  const [priceMap, setPriceMap] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get("/pizza/inventory");
        const data = res.data || {};

        setInventory({
          base: data.base || [],
          sauce: data.sauce || [],
          cheese: data.cheese || [],
          veggies: data.veggies || [],
          meat: data.meat || [],
        });

        const newPriceMap = {};
        Object.entries(data).forEach(([type, items]) => {
          newPriceMap[type] = {};
          items.forEach((item) => {
            newPriceMap[type][item.itemName] = item.price;
          });
        });
        setPriceMap(newPriceMap);
      } catch (err) {
        console.error("Error loading inventory", err);
        setMessage("Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  useEffect(() => {
    let total = 0;
    if (selection.base && priceMap.base) total += priceMap.base[selection.base] || 0;
    if (selection.sauce && priceMap.sauce) total += priceMap.sauce[selection.sauce] || 0;
    if (selection.cheese && priceMap.cheese) total += priceMap.cheese[selection.cheese] || 0;
    if (Array.isArray(selection.veggies) && priceMap.veggies)
      selection.veggies.forEach((v) => (total += priceMap.veggies[v] || 0));
    if (Array.isArray(selection.meat) && priceMap.meat)
      selection.meat.forEach((m) => (total += priceMap.meat[m] || 0));

    setPrice(total);
  }, [selection, priceMap]);

  const toggleIngredient = (type, name) => {
    setSelection((prev) => {
      const current = prev[type];
      return {
        ...prev,
        [type]: current.includes(name)
          ? current.filter((i) => i !== name)
          : [...current, name],
      };
    });
  };

  const handlePayment = async () => {
    if (!user) {
      setMessage("Please login to place an order.");
      return;
    }

    if (!selection.base || !selection.sauce || !selection.cheese) {
      setMessage("Please select base, sauce and cheese");
      return;
    }

    setMessage("Redirecting to payment...");

    try {
      const { data: orderData } = await axios.post("/order/create-order", {
        pizzaDetails: selection,
        totalPrice: price,
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
            pizzaDetails: selection,
            totalPrice: price,
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
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
        rzp1.on("payment.failed", function () {
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

  if (loading) return <p className="text-center mt-10 text-gray-300 dark:text-gray-400">Loading inventory...</p>;

  return (
    <div className="overflow-hidden max-w-3xl mx-auto p-6 mt-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-orange-500 dark:text-orange-400 mb-4">Build Your Custom Pizza</h2>

      {["base", "sauce", "cheese"].map((type) => (
        <div key={type} className="mb-4">
          <h3 className="font-semibold text-lg capitalize mb-2">{type}</h3>
          <div className="flex flex-wrap gap-4">
            {inventory[type].map((item) => (
              <label key={item._id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={type}
                  value={item.itemName}
                  checked={selection[type] === item.itemName}
                  onChange={(e) =>
                    setSelection({ ...selection, [type]: e.target.value })
                  }
                  disabled={item.quantity <= 0}
                  className="accent-orange-500"
                />
                <span className={item.quantity <= 0 ? "text-gray-400 line-through" : ""}>
                  {item.itemName} ({item.quantity})
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {["veggies", "meat"].map((type) => (
        <div key={type} className="mb-4">
          <h3 className="font-semibold text-lg capitalize mb-2">{type} (multiple)</h3>
          <div className="flex flex-wrap gap-4">
            {inventory[type].map((item) => (
              <label key={item._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={type}
                  value={item.itemName}
                  checked={selection[type].includes(item.itemName)}
                  onChange={() => toggleIngredient(type, item.itemName)}
                  disabled={item.quantity <= 0}
                  className="accent-orange-500"
                />
                <span className={item.quantity <= 0 ? "text-gray-400 line-through" : ""}>
                  {item.itemName} ({item.quantity})
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <h3 className="text-xl font-semibold mt-6 mb-2">Total Price: ₹{price}</h3>

      <button
        onClick={handlePayment}
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded w-full transition duration-200"
      >
        Proceed to Payment
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-300 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
};

export default PizzaBuilder;
