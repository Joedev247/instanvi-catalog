"use client";
import React, { useState } from "react";
import { PiPlus } from "react-icons/pi";

export default function ProductRow({
  product,
  onAdd,
  editing,
  priceEdit,
  onPriceChange,
}: {
  product: any;
  onAdd: (product: any, selected?: string, quantity?: number) => void;
  editing?: boolean;
  priceEdit?: { priceMin: number; priceMax: number } | undefined;
  onPriceChange?: (id: string, priceMin: number, priceMax: number) => void;
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
        {!editing ? (
          <div className="text-sm text-gray-700 font-medium">{price} - {product.priceMax}</div>
        ) : (
          <div className="flex gap-2">
            <input type="number" value={priceEdit?.priceMin ?? price} onChange={(e) => onPriceChange && onPriceChange(product.id, Number(e.target.value || 0), priceEdit?.priceMax ?? product.priceMax)} className="border px-2 py-1 w-24" />
            <input type="number" value={priceEdit?.priceMax ?? product.priceMax} onChange={(e) => onPriceChange && onPriceChange(product.id, priceEdit?.priceMin ?? price, Number(e.target.value || 0))} className="border px-2 py-1 w-24" />
          </div>
        )}
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
          className="inline-flex items-center justify-center p-2 text-green-500 hover:bg-green-50  transition"
          aria-label={`Add ${product.name}`}
          title="Add to cart"
        >
          <PiPlus size={16} />
        </button>
      </td>
    </tr>
  );
}
