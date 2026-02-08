"use client";
import React, { useState, useEffect } from "react";
import { PiX } from "react-icons/pi";

type Customer = {
  id: string;
  name: string;
  email?: string;
  category?: string;
  createdAt: string;
};

type Catalog = {
  id: string;
  name: string;
  category: string;
};

export default function CreateCustomerModal({
  open,
  onClose,
  onCreate,
  categories,
  catalogs,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (customer: Omit<Customer, "id" | "createdAt">) => void;
  categories: string[];
  catalogs: Catalog[];
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    setError(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (category) {
      const catalogExists = catalogs.some((c) => c.category === category);
      if (!catalogExists) {
        setError(`No catalog exists for "${category}" category. Please create a catalog first.`);
        return;
      }
    }
    onCreate({ name: name.trim(), email: email.trim() || undefined, category: category || undefined });
    setName("");
    setEmail("");
    setCategory(null);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className={`fixed z-50 bg-white transform transition-transform duration-300 ease-out overflow-y-auto 
          ${open ? "translate-x-0" : "translate-x-full"}
          right-0 top-0 bottom-0 h-full w-full md:w-96`}
        role="dialog"
        aria-modal="true"
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
          <h2 className="text-xl font-bold text-black">Create Customer</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-gray-600 hover:bg-gray-100  transition"
          >
            <PiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter customer name"
              className="w-full border border-gray-300 px-4 py-2  text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full border border-gray-300 px-4 py-2  text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category ?? ""}
              onChange={(e) => setCategory(e.target.value || null)}
              className="w-full border border-gray-300 px-4 py-2  text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select category</option>
              <option value="Default">Default</option>
              {categories.filter((c) => c !== "Other").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 ">{error}</div>}

          <button
            onClick={handleCreate}
            className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold  transition"
          >
            Create Customer
          </button>
        </div>
      </div>
    </div>
  );
}
