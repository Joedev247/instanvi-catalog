"use client";
import React, { useEffect, useState } from "react";
import { PiX } from "react-icons/pi";

type Catalog = { id: string; name: string; category: string };

export default function GrantAccessModal({
  open,
  onClose,
  catalogs,
  customer,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  catalogs: Catalog[];
  customer: { id: string; name: string; category?: string; catalogAccess?: string[] } | null;
  onSave: (customerId: string, access: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (customer) setSelected(customer.catalogAccess || []);
  }, [customer]);

  // Filter catalogs by customer's category type (matching catalog category)
  const customerCategory = customer?.category || "Default";
  const availableCatalogs = catalogs.filter((c) => c.category === customerCategory || c.category === "Default");
  const filtered = availableCatalogs.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase()));

  const toggle = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const handleSave = () => {
    if (!customer) return;
    onSave(customer.id, selected);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} aria-hidden={!open}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className={`fixed z-50 bg-white transform transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"} right-0 top-0 bottom-0 h-full w-full md:w-96`} role="dialog" aria-modal="true">
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Grant Access</div>
            <div className="text-lg font-semibold text-black">{customer?.name || "Customer"}</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 text-gray-600 hover:bg-gray-100 ">
            <PiX size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search catalogs..." className="w-full border border-gray-300 px-3 py-2  text-sm" />
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-sm text-gray-500">No catalogs found.</div>
            ) : (
              filtered.map((c) => (
                <label key={c.id} className="flex items-center justify-between bg-white border border-gray-200  p-3 hover:bg-gray-50">
                  <div>
                    <div className="font-medium text-black">{c.name}</div>
                    <div className="text-xs text-gray-600">{c.category}</div>
                  </div>
                  <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} className="w-4 h-4" />
                </label>
              ))
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={handleSave} className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 ">Save</button>
            <button onClick={onClose} className="flex-1 border border-gray-300 px-4 py-2 ">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
