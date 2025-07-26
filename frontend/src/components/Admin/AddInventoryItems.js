// This file helps admin to add new items to the inventory

import React, { useState } from "react";
import axios from "../../utils/api";

const InventoryManagement = () => {
  const [newItem, setNewItem] = useState({
    itemType: "",
    itemName: "",
    quantity: 0,
    price: 100,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const addNewItem = async () => {
    try {
      await axios.post("/admin/inventory", newItem);
      setNewItem({ itemType: "", itemName: "", quantity: 0, price: 100 });
      setSuccessMessage("Item added successfully!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage("Error adding item.");
      setSuccessMessage("");
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Add Items to Inventory</h2>

      {successMessage && (
        <p className="text-green-400 text-center mb-3">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-400 text-center mb-3">{errorMessage}</p>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Add New Inventory Item</h3>
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <select
            value={newItem.itemType}
            onChange={(e) =>
              setNewItem({ ...newItem, itemType: e.target.value })
            }
            className="p-2 bg-gray-800 border border-gray-700 rounded w-36"
          >
            <option value="">Select Type</option>
            <option value="base">Base</option>
            <option value="sauce">Sauce</option>
            <option value="cheese">Cheese</option>
            <option value="veggies">Veggies</option>
            <option value="meat">Meat</option>
          </select>

          <input
            type="text"
            placeholder="Item Name"
            value={newItem.itemName}
            onChange={(e) =>
              setNewItem({ ...newItem, itemName: e.target.value })
            }
            className="p-2 bg-gray-800 border border-gray-700 rounded flex-1"
          />

          <input
            type="number"
            min={0}
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: Number(e.target.value) })
            }
            className="p-2 bg-gray-800 border border-gray-700 rounded w-28"
          />

          <input
            type="number"
            min={100}
            placeholder="Price"
            value={newItem.price}
            onChange={(e) =>
              setNewItem({ ...newItem, price: Number(e.target.value) })
            }
            className="p-2 bg-gray-800 border border-gray-700 rounded w-28"
          />

          <button
            onClick={addNewItem}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded shadow"
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
