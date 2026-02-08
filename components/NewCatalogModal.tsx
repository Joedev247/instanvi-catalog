"use client";

import React, { useEffect, useState } from "react";
import { PiX } from "react-icons/pi";

type Product = {
  id: string;
  name: string;
  priceMin: number;
  priceMax?: number;
  img?: string;
  types?: string[];
};

export default function NewCatalogModal({
  open,
  onClose,
  products,
  categories,
  onCreate,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  products: Product[];
  categories: string[];
  onCreate: (payload: { name: string; category: string | null; prices: { [productId: string]: { priceMin: number; priceMax?: number } } }) => void;
  initial?: { name?: string; category?: string | null; prices?: { [id: string]: { priceMin: number; priceMax?: number } } } | null;
}) {
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceEdits, setPriceEdits] = useState<{ [id: string]: { priceMin: number; priceMax?: number } }>({});

  useEffect(() => {
    if (!open) {
      setName("");
      setSelectedCategory(null);
      setPriceEdits({});
    } else {
      // initialize from products, then override with initial prices if provided
      const init: any = {};
      products.forEach((p) => {
        init[p.id] = { priceMin: p.priceMin || 0, priceMax: p.priceMax ?? p.priceMin };
      });
      if (initial) {
        if (initial.name) setName(initial.name);
        if (typeof initial.category !== "undefined") setSelectedCategory(initial.category ?? null);
        if (initial.prices) {
          Object.keys(initial.prices).forEach((id) => {
            init[id] = { priceMin: initial.prices![id].priceMin ?? init[id]?.priceMin ?? 0, priceMax: initial.prices![id].priceMax ?? init[id]?.priceMax };
          });
        }
      }
      setPriceEdits(init);
    }
  }, [open, products, initial]);

  const handleSave = () => {
    if (!name.trim()) return alert("Catalog name is required");
    const payload = { name: name.trim(), category: selectedCategory, prices: priceEdits };
    onCreate(payload);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-60 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} aria-hidden={!open}>
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      <aside className={`fixed right-0 top-0 h-full w-full sm:w-[780px] bg-white text-black shadow-md border-l border-gray-100 transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-black">Create Catalog</h3>
          <button onClick={onClose} className="p-2  hover:bg-gray-100 text-black"><PiX size={18} /></button>
        </div>

        <div className="p-4 space-y-4 overflow-auto h-full text-black">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Catalog name" className="border border-gray-100 px-3 py-2 text-gray-900" />
            <select value={selectedCategory ?? ""} onChange={(e) => setSelectedCategory(e.target.value || null)} className="border border-gray-100 px-3 py-2 text-gray-900">
              <option value="">Select customer category</option>
              {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            <div className="flex items-center gap-2">
              <button onClick={() => {
                // set all prices to current product prices
                const init: any = {};
                products.forEach((p) => init[p.id] = { priceMin: p.priceMin, priceMax: p.priceMax ?? p.priceMin });
                setPriceEdits(init);
              }} className="px-3 py-2 bg-gray-100 ">Reset prices</button>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-900 mb-2 font-medium">Products — edit prices</div>
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-3 border border-gray-100 p-2 bg-white">
                  <div className="w-16 h-12 bg-gray-100  overflow-hidden">
                    <img src={p.img || "https://via.placeholder.com/200"} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-600">{p.types?.join(", ")}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" className="border border-gray-100 px-2 py-1 w-28 text-gray-900" value={priceEdits[p.id]?.priceMin ?? p.priceMin} onChange={(e) => setPriceEdits((prev) => ({ ...prev, [p.id]: { priceMin: Number(e.target.value || 0), priceMax: prev[p.id]?.priceMax ?? p.priceMax ?? prev[p.id]?.priceMin } }))} />
                    <input type="number" className="border border-gray-100 px-2 py-1 w-28 text-gray-900" value={priceEdits[p.id]?.priceMax ?? p.priceMax ?? p.priceMin} onChange={(e) => setPriceEdits((prev) => ({ ...prev, [p.id]: { priceMin: prev[p.id]?.priceMin ?? p.priceMin, priceMax: Number(e.target.value || 0) } }))} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSave} className={`bg-[var(--instanvi-primary)] hover:bg-[var(--instanvi-primary-600)] text-white px-4 py-2 `}>Create Catalog</button>
            <button onClick={onClose} className="border border-gray-300 px-4 py-2 ">Cancel</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
