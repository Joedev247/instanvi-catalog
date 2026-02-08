"use client";
import React, { useState } from "react";
import { PiTrash, PiX, PiCheckCircle, PiClock } from "react-icons/pi";

export default function Summary({
  totalProducts,
  totalAmount,
  history = [],
  onDelete,
  onClear,
  onPay,
  onCheckout,
}: {
  totalProducts: number;
  totalAmount: number;
  history?: Array<{ id: string; name: string; price: number; img?: string; type?: string; quantity?: number; when: string; paid?: boolean }>;
  onDelete?: (when: string) => void;
  onClear?: () => void;
  onPay?: (when: string) => Promise<void>;
  onCheckout?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  const formatCurrency = (v: number) => `${v.toLocaleString()} XAF`;

  async function handlePayClick(when: string) {
    if (!onPay) return;
    setProcessing(when);
    try {
      await onPay(when);
    } finally {
      setProcessing(null);
    }
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
        className="bg-white border border-gray-200  p-4 shadow-sm hover:shadow-md cursor-pointer transition flex items-center justify-between"
        aria-label="Open checkout"
      >
        <div>
          <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Cart</div>
          <div className="text-2xl font-bold text-black">{totalProducts}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Total</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setOpen(false)}
        />

        <div
          className={`fixed inset-0 z-50 bg-white flex flex-col transform transition-transform duration-300 ease-out ${open ? "translate-y-0" : "translate-y-full"}`}
          role="dialog"
          aria-modal="true"
        >
          {/* Header - Both Mobile and Desktop */}
          <div className="flex-shrink-0 border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-black">
                <span className="lg:hidden">Order Summary</span>
                <span className="hidden lg:inline">Your Cart</span>
              </h2>
              <p className="text-sm text-gray-600 mt-1 lg:hidden">{history.length} item{history.length !== 1 ? 's' : ''} in your order</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClear && onClear();
                  setOpen(false);
                }}
                aria-label="Clear order"
                className="p-2 text-red-600 hover:bg-red-50  transition"
                title="Clear order"
              >
                <PiTrash size={24} />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close checkout"
                className="p-2 text-gray-600 hover:bg-gray-100  transition"
              >
                <PiX size={24} />
              </button>
            </div>
          </div>

          {/* Main Content Area - Products + Sidebar */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Products Section */}
            <div className="flex-1 overflow-auto lg:border-r lg:border-gray-200">
              <div className="px-4 lg:px-6 py-6">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-center">
                      <div className="text-4xl mb-4">🛒</div>
                      <p className="text-base text-gray-700 font-medium">Your cart is empty</p>
                      <p className="text-sm text-gray-600 mt-1">Add products to get started</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-6xl">
                    {history.map((h) => (
                      <div
                        key={h.when}
                        className={`border  overflow-hidden transition ${
                          h.paid ? "border-green-200 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex gap-4 p-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={h.img || "https://via.placeholder.com/80"}
                              alt={h.name}
                              className="w-20 h-20 object-cover bg-gray-100 "
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-black text-base">{h.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  {h.type && <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 ">{h.type}</span>}
                                  {h.quantity && <span className="text-xs text-gray-600">Qty: {h.quantity}</span>}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">{new Date(h.when).toLocaleString()}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-lg font-bold text-black">{formatCurrency(h.price)}</div>
                              </div>
                            </div>

                            {/* Status & Actions */}
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-2">
                                {h.paid ? (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <PiCheckCircle size={16} />
                                    <span className="text-xs font-medium">Paid</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-amber-600">
                                    <PiClock size={16} />
                                    <span className="text-xs font-medium">Pending</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {!h.paid && (
                                  <button
                                    onClick={() => handlePayClick(h.when)}
                                    disabled={processing !== null}
                                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-3 py-1.5 text-xs font-semibold  transition"
                                  >
                                    {processing === h.when ? "Processing..." : "Pay Now"}
                                  </button>
                                )}
                                <button
                                  onClick={() => onDelete && onDelete(h.when)}
                                  className="p-1.5 text-gray-600 hover:bg-red-50 hover:text-red-600  transition"
                                  aria-label="Remove item"
                                >
                                  <PiTrash size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Desktop Only */}
            {history.length > 0 && (
              <div className="hidden lg:flex lg:flex-col flex-shrink-0 w-[550px] border-l border-gray-200 bg-white">
                <div className="flex-shrink-0 border-t border-gray-200 px-8 py-8">
                  {/* Order Summary Header */}
                  <h3 className="text-lg font-semibold text-black mb-6">Order Summary</h3>

                  {/* Totals */}
                  <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Subtotal</span>
                      <span className="text-black font-semibold">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Shipping</span>
                      <span className="text-black font-semibold">Free</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-black font-bold text-lg">Total</span>
                      <span className="text-green-600 font-bold text-2xl">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        onCheckout && onCheckout();
                        setOpen(false);
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 font-semibold transition "
                    >
                      Checkout
                    </button>
                    <button
                      onClick={() => setOpen(false)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 font-semibold transition "
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Footer */}
          {history.length > 0 && (
            <div className="lg:hidden flex-shrink-0 border-t border-gray-200 bg-white px-4 py-6">
              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-black">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-3">
                  <span className="font-semibold text-black">Total</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onCheckout && onCheckout();
                    setOpen(false);
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 font-semibold transition"
                >
                  Checkout
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 border border-gray-300 text-black px-4 py-2.5 font-semibold hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
