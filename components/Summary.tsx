"use client";
import React, { useState } from "react";
import { PiTrash, PiX } from "react-icons/pi";

export default function Summary({
  totalProducts,
  totalAmount,
  history = [],
  onDelete,
  onClear,
  onPay,
}: {
  totalProducts: number;
  totalAmount: number;
  history?: Array<{ id: string; name: string; price: number; img?: string; type?: string; quantity?: number; when: string; paid?: boolean }>;
  onDelete?: (when: string) => void;
  onClear?: () => void;
  onPay?: (when: string) => Promise<void>;
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
        className="instanvi-surface p-4 shadow-sm flex items-center justify-between cursor-pointer"
        aria-label="Open purchase history"
      >
        <div>
          <div className="text-sm text-gray-700 font-medium">Products</div>
          <div className="text-xl font-bold text-black">{totalProducts}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-700 font-medium">Total Amount</div>
          <div className="text-xl font-bold text-black">{formatCurrency(totalAmount)}</div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setOpen(false)}
        />

        <div
          className={`fixed left-0 right-0 top-0 bottom-0 z-50 bg-white shadow-lg transform transition-transform duration-300 ease-out ${open ? "translate-y-0" : "translate-y-full"} overflow-auto`}
          role="dialog"
          aria-modal="true"
        >
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Purchase History</div>
              <div className="text-lg font-semibold text-black">{history.length} item{history.length !== 1 ? 's' : ''}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { onClear && onClear(); }}
                className="text-sm text-red-600 px-3 border"
              >
                Clear History
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close history"
                className="p-2 text-gray-600 hover:bg-gray-100  transition"
              >
                <PiX size={20} />
              </button>
            </div>
          </div>

          <div className="p-3 overflow-auto">
            {history.length === 0 ? (
              <div className="text-sm text-gray-700">No purchases yet.</div>
            ) : (
              <ul className="space-y-4">
                {history.map((h) => (
                  <li key={h.when} className="flex items-start gap-3 justify-between border-b pb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <img src={h.img || "https://via.placeholder.com/64"} alt={h.name} className="w-12 h-12 object-cover bg-gray-100 flex-shrink-0 rounded" />
                      <div className="flex-1">
                        <div className="font-medium text-black text-sm">{h.name}</div>
                        <div className="text-xs text-gray-600">{h.type ? `${h.type}` : ''}{h.quantity ? ` • Qty: ${h.quantity}` : ''}</div>
                        <div className="text-xs text-gray-500">{new Date(h.when).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`text-xs font-medium ${h.paid ? 'text-green-600' : 'text-amber-600'}`}>{h.paid ? '✓ Paid' : '⏱ Pending'}</div>
                        {!h.paid && (
                          <button
                            onClick={() => handlePayClick(h.when)}
                            disabled={processing !== null}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs font-medium shadow transition"
                          >
                            {processing === h.when ? 'Processing...' : 'Pay Now'}
                          </button>
                        )}

                        <button
                          onClick={() => onDelete && onDelete(h.when)}
                          className="p-1 text-red-600 hover:bg-red-50 transition"
                          aria-label="Delete purchase"
                        >
                          <PiTrash size={16} />
                        </button>
                      </div>
                      <div className="text-base font-semibold text-black">{formatCurrency(h.price)}</div>

                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
