"use client";
import React, { useState } from "react";
import { PiPlus, PiMinus } from "react-icons/pi";

export default function ProductRow({
  product,
  onAdd,
}: {
  product: any;
  onAdd: (product: any, selected?: string, quantity?: number) => void;
}) {
  const [selected, setSelected] = useState(product.types?.[0] ?? "");
  const [quantity, setQuantity] = useState(1);

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
      <td className="p-4 align-top">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-1 text-gray-600 hover:bg-gray-100  transition"
            aria-label="Decrease quantity"
          >
            <PiMinus size={16} />
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-12 text-center border border-gray-300  text-black font-medium"
            aria-label="Quantity"
          />
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-1 text-gray-600 hover:bg-gray-100  transition"
            aria-label="Increase quantity"
          >
            <PiPlus size={16} />
          </button>
        </div>
      </td>
      <td className="p-4 align-top text-right">
        <button
          onClick={() => {
            for (let i = 0; i < quantity; i++) {
              onAdd(product, selected, 1);
            }
            setQuantity(1);
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 instanvi-btn-primary  text-sm shadow"
          aria-label={`Add ${product.name}`}
        >
          <PiPlus size={16} />
          Add
        </button>
      </td>
    </tr>
  );
}
