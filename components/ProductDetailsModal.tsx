"use client";
import React, { useEffect, useState } from "react";
import { PiX, PiShoppingCart } from "react-icons/pi";

type Product = {
  id: string;
  name: string;
  priceMin: number;
  priceMax: number;
  img?: string;
  types: string[];
  category?: string;
};

export default function ProductDetailsModal({
  open,
  onClose,
  product,
  onPay,
  initialType,
  initialQuantity,
}: {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  onPay: (productId: string, type: string | undefined, quantity: number) => Promise<void> | void;
  initialType?: string;
  initialQuantity?: number;
}) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedType(initialType ?? product?.types?.[0] ?? "");
    setQuantity(initialQuantity ?? 1);
  }, [product, initialType, initialQuantity]);

  if (!product) return null;

  const handlePayClick = async () => {
    setLoading(true);
    try {
      await onPay(product.id, selectedType || undefined, quantity);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} aria-hidden={!open}>
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        <div className={`fixed left-0 right-0 bottom-0 top-0 z-60 bg-white transform transition-transform duration-300 ease-out ${open ? "translate-y-0" : "translate-y-full"} overflow-auto`}>
          <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white z-10">
            <div className="text-base font-semibold text-black truncate">{product.name}</div>
            <button onClick={onClose} className="p-2 text-black hover:bg-gray-100 rounded">
              <PiX size={20} />
            </button>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1">
              <div className="w-full h-44 sm:h-48 bg-gray-100 rounded overflow-hidden">
                <img src={product.img || "https://via.placeholder.com/400"} alt={product.name} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="mb-2 text-sm text-black">Price range: {product.priceMin} - {product.priceMax} XAF</div>

              <div className="mb-4 flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-black mb-1">Type</label>
                  <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full border border-gray-300 px-2 py-1 rounded text-black text-sm">
                    {product.types.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-black mb-1">Quantity</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-1 bg-gray-200 rounded text-black">−</button>
                    <div className="w-10 text-center text-black font-medium">{quantity}</div>
                    <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-1 bg-gray-200 rounded text-black">+</button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={handlePayClick} disabled={loading} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
                  <PiShoppingCart />
                  {loading ? "Processing…" : `Pay ${product.priceMin * quantity} XAF`}
                </button>

                <button onClick={onClose} className="flex-1 px-4 py-2 border rounded text-black">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
