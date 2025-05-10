"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import "../styles.css";

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [highlightOrderId, setHighlightOrderId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const userData = localStorage.getItem("user");
      const parsedUser = userData ? JSON.parse(userData) : null;
      setUser(parsedUser);
      if (parsedUser) {
        fetchOrders(parsedUser.userId);
      }
    } catch (e) {
      setError("Failed to load user.");
      setLoading(false);
    }
  }, [router]);

  const fetchOrders = async (userId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/api/orders/byUser/${userId}`
      );
      let ordersData = res.data || [];
      // Sort orders by createdAt descending (most recent first)
      ordersData = ordersData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(ordersData);

      // If redirected from payment, highlight the latest order
      if (
        searchParams &&
        searchParams.get("highlight") === "latest" &&
        ordersData.length > 0
      ) {
        setHighlightOrderId(ordersData[0].orderId);
      }
      setError("");
    } catch (e) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo">Swiftthrift</div>
        <ul className="nav-links">
          <li>
            <a onClick={() => router.push("/products")}>Products</a>
          </li>
          <li>
            <a onClick={() => router.push("/wishlist")}>Wishlist</a>
          </li>
          <li>
            <a onClick={() => router.push("/cart")}>Cart</a>
          </li>
          <li>
            <a className="active">Orders</a>
          </li>
          <li>
            <a onClick={() => router.push("/about")}>About Us</a>
          </li>
        </ul>
        <div className="auth-links">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>
      <div className="page-header">
        <h1>Your Orders</h1>
        <p>Track your purchases and order status</p>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="no-products">
            <p>You have no orders yet.</p>
            <button
              className="browse-products-btn"
              onClick={() => router.push("/products")}
            >
              Browse Products
            </button>
          </div>
        ) : (
          orders.map((order, idx) => (
            <div
              key={order.orderId}
              className={`order-item${
                order.orderId === highlightOrderId ? " highlighted-order" : ""
              }`}
              style={
                order.orderId === highlightOrderId
                  ? { border: "2px solid #38a169", background: "#f6ffed" }
                  : {}
              }
            >
              <h4>
                Order #{order.orderId}
                {order.orderId === highlightOrderId && (
                  <span
                    style={{
                      color: "#38a169",
                      marginLeft: 8,
                      fontWeight: 600,
                    }}
                  >
                    (Latest Order)
                  </span>
                )}
              </h4>
              <p>
                Status: <strong>{order.status}</strong>
              </p>
              <p>
                Total:{" "}
                <strong>
                  ₱
                  {order.totalPrice?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </p>
              <p>
                Date:{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "N/A"}
              </p>
              <div>
                <strong>Items:</strong>
                <ul>
                  {order.orderItems && order.orderItems.length > 0
                    ? order.orderItems.map((item) => (
                        <li key={item.orderItemId}>
                          {item.product?.name || "Product"} x{item.quantity || 1} - ₱
                          {item.subtotal?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </li>
                      ))
                    : "No items"}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
      <footer className="footer">
        <p>&copy; 2025 Swiftthrift. All rights reserved.</p>
      </footer>
    </div>
  );
}
