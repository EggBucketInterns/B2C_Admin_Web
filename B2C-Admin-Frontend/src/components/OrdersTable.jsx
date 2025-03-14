import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "ascending",
  });

  const navigate = useNavigate();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://b2c-49u4.onrender.com/api/v1/order/order"
        );
        const fetchedOrders = response.data.orders || [];
        setOrders(fetchedOrders);
        setLoading(false);
      } catch (error) {
        setError("Failed to load orders. Please try again later.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Sorting function
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortConfig.direction === "ascending") {
      return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
    } else {
      return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
    }
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = (index) => {
    const newOrders = orders.filter((_, i) => i !== index);
    setOrders(newOrders);
    setSuccessMessage("Order has been successfully deleted");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData({ ...orders[index] }); // Clone the data to avoid mutating the state directly
  };
  
  const handleSaveEdit = () => {
    if (editIndex === null || !editData) return;
  
    const updatedOrders = [...orders];
    updatedOrders[editIndex] = editData; // Update the edited row
    setOrders(updatedOrders);
    setEditIndex(null); // Exit edit mode
    setEditData(null); // Clear edit data
    setSuccessMessage("Order has been successfully updated");
    setTimeout(() => setSuccessMessage(""), 3000);
  };
  
  const handleEditChange = (key, value) => {
    setEditData((prev) => ({
      ...prev,
      [key]: value, // Dynamically update the specific field being edited
    }));
  };
  return (
    <div className="bg-white p-6 shadow rounded mb-6 h-full">
      <h3 className="text-lg font-semibold mb-4">Latest Orders</h3>
  
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}
  
      <div
        className="overflow-y-auto"
        style={{ maxHeight: "70vh", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}
      >
        {!loading && !error && (
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200">
                <th
                  className="p-4 text-left cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  Order ID
                </th>
                <th
                  className="p-4 text-left cursor-pointer"
                  onClick={() => handleSort("products")}
                >
                  Products
                </th>
                <th
                  className="p-4 text-left cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  Amount
                </th>
                <th
                  className="p-4 text-left cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                </th>
                <th
                  className="p-4 text-left cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Order Date
                </th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(sortedOrders) &&
                sortedOrders.map((order, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition duration-200 cursor-pointer"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    <td className="p-4 border-b">{order.id}</td>
                    <td className="p-4 border-b">
                      {Object.entries(order.products)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", ")}
                    </td>
                    <td className="p-4 border-b">Rs {order.amount}</td>
                    <td className="p-4 border-b">{order.status}</td>
                    <td className="p-4 border-b">
                      {new Date(order.createdAt._seconds * 1000).toLocaleDateString()}
                    </td>
                    <td className="p-4 border-b flex space-x-2">
                      <FaEdit
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(index);
                        }}
                        className="text-blue-500 cursor-pointer"
                      />
                      <FaTrash
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(index);
                        }}
                        className="text-red-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
  
};

export default OrdersTable;
