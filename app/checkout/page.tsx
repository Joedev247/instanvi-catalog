"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PiArrowLeft, PiCheckCircle, PiClock } from "react-icons/pi";

type HistoryItem = {
  id: string;
  name: string;
  price: number;
  img?: string;
  type?: string;
  quantity?: number;
  when: string;
  paid?: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("instanvi_cart_history");
      if (raw) {
        const parsed = JSON.parse(raw);
        setHistory(parsed);
        const total = parsed.reduce((sum: number, item: HistoryItem) => sum + (item.price * (item.quantity || 1)), 0);
        setTotalAmount(total);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const formatCurrency = (v: number) => `${v.toLocaleString()} XAF`;

  const handleCheckout = async () => {
    if (!customerName.trim() || history.length === 0) {
      alert("Please enter customer name and ensure cart is not empty");
      return;
    }

    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mark all items as paid
      const updatedHistory = history.map((item) => ({ ...item, paid: true }));
      localStorage.setItem("instanvi_cart_history", JSON.stringify(updatedHistory));

      // Save order
      const order = {
        id: `order_${Date.now()}`,
        customerName,
        customerPhone,
        customerEmail,
        items: updatedHistory,
        totalAmount,
        paymentMethod,
        notes,
        createdAt: new Date().toISOString(),
      };

      const orders = JSON.parse(localStorage.getItem("instanvi_orders") || "[]");
      orders.push(order);
      localStorage.setItem("instanvi_orders", JSON.stringify(orders));

      // Clear cart
      localStorage.setItem("instanvi_cart_history", JSON.stringify([]));

      // Success feedback
      alert("Order placed successfully!");
      router.push("/catalog");
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200  transition text-gray-700"
            aria-label="Go back"
          >
            <PiArrowLeft size={24} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-black">Checkout</h1>
        </div>

        {history.length === 0 ? (
          <div className="bg-white  shadow p-8 text-center">
            <div className="text-4xl mb-4">🛒</div>
            <p className="text-lg text-gray-700 font-medium">Your cart is empty</p>
            <button
              onClick={() => router.push("/catalog")}
              className="mt-4 px-4 py-2 bg-green-500 text-white  hover:bg-green-600 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white  shadow p-6">
                <h2 className="text-xl font-bold text-black mb-4">Order Items</h2>
                <div className="space-y-4">
                  {history.map((item) => (
                    <div
                      key={item.when}
                      className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                    >
                      <img
                        src={item.img || "https://via.placeholder.com/80"}
                        alt={item.name}
                        className="w-20 h-20 object-cover bg-gray-100 "
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-black">{item.name}</h3>
                        {item.type && (
                          <p className="text-sm text-gray-600">Type: {item.type}</p>
                        )}
                        <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                        <p className="mt-2 font-semibold text-green-600">
                          {formatCurrency(item.price * (item.quantity || 1))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white  shadow p-6">
                <h2 className="text-xl font-bold text-black mb-4">Customer Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      className="w-full border border-gray-300 px-4 py-2  text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Phone number"
                        className="w-full border border-gray-300 px-4 py-2  text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full border border-gray-300 px-4 py-2  text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white  shadow p-6">
                <h2 className="text-xl font-bold text-black mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {["cash", "card", "bank_transfer"].map((method) => (
                    <label key={method} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700">
                        {method === "cash"
                          ? "Cash"
                          : method === "card"
                          ? "Card"
                          : "Bank Transfer"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white  shadow p-6">
                <h2 className="text-xl font-bold text-black mb-4">Additional Notes</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any special instructions or notes"
                  rows={4}
                  className="w-full border border-gray-300 px-4 py-2  text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white  shadow p-6 sticky top-4">
                <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-black">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-black">Free</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-black">Total</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={processing}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3  transition"
                >
                  {processing ? "Processing..." : "Place Order"}
                </button>

                <button
                  onClick={() => router.push("/catalog")}
                  disabled={processing}
                  className="w-full mt-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2  transition disabled:opacity-50"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
