"use client";
import React, { useState } from "react";
import { PiShoppingCart } from "react-icons/pi";

export default function ProductRow({
  product,
  onAdd,
}: {
  product: any;
  onAdd: (product: any, selected?: string, quantity?: number) => void;
}) {
  const [selected, setSelected] = useState(product.types?.[0] ?? "");
  

  const price = product.priceMin || 0;

  return (
    <tr className="border-b last:border-b-0">
      <td className="p-4 align-top">
        <div className="w-20 h-20 bg-gray-200  flex items-center justify-center text-sm text-gray-700">
          Product image
        </div>
      </td>
      <td className="p-4 align-top">
        <div className="font-semibold text-black">{product.name}</div>
        <div className="text-sm text-gray-700 font-medium">{price} - {product.priceMax}</div>
      </td>
      <td className="p-4 align-top">
        <select
          className="border border-gray-300 px-3 py-1 text-black text-sm"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {(product.types || []).map((t: string) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </td>
      <td className="p-4 align-top text-right">
        <button
          onClick={() => onAdd(product, selected, 1)}
          className="inline-flex items-center justify-center p-2 text-green-500 hover:bg-green-50 rounded transition"
          aria-label={`Add ${product.name}`}
          title="Add to cart"
        >
          <PiShoppingCart size={16} />
        </button>
      </td>
    </tr>
  );
}
