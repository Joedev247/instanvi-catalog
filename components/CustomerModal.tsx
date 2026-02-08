"use client";
import React, { useState } from "react";
import { PiX, PiPlus, PiTrash } from "react-icons/pi";

type Customer = {
  id: string;
  name: string;
  category: string;
  phone?: string;
  email?: string;
  createdAt?: string;
};

export default function CustomerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerCategory, setNewCustomerCategory] = useState("Wholesaler");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");

  // Load customers from localStorage on mount
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("instanvi_customers");
      if (raw) setCustomers(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, [open]);

  // Persist customers to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("instanvi_customers", JSON.stringify(customers));
    } catch (e) {
      // ignore
    }
  }, [customers]);

  const handleAddCustomer = () => {
    if (!newCustomerName.trim()) return;
    const id = `cust_${Date.now()}`;
    const customer: Customer = {
      id,
      name: newCustomerName.trim(),
      category: newCustomerCategory,
      phone: newCustomerPhone || undefined,
      email: newCustomerEmail || undefined,
      createdAt: new Date().toISOString(),
    };
    setCustomers((s) => [customer, ...s]);
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewCustomerEmail("");
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers((s) => s.filter((c) => c.id !== id));
  };

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-gray-700/40"
        onClick={onClose}
      />

      <div
        className={`fixed z-50 bg-white transform transition-transform duration-300 ease-out overflow-y-auto 
          ${open ? "translate-x-0" : "translate-x-full"}
          right-0 top-0 bottom-0 h-full w-full md:w-96`}
        role="dialog"
        aria-modal="true"
      >
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-sm text-gray-600">Customers</div>
            <div className="text-lg font-semibold text-black">{customers.length} Customers</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close customers"
            className="p-2 text-gray-600 hover:bg-gray-100 transition"
          >
            <PiX size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                placeholder="Customer name"
                className="w-full border border-gray-300 px-3 py-2  text-sm text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newCustomerCategory}
                onChange={(e) => setNewCustomerCategory(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2  text-sm text-black"
              >
                <option value="Wholesaler">Wholesaler</option>
                <option value="Retailer">Retailer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full border border-gray-300 px-3 py-2  text-sm text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newCustomerEmail}
                onChange={(e) => setNewCustomerEmail(e.target.value)}
                placeholder="Email address"
                className="w-full border border-gray-300 px-3 py-2  text-sm text-black"
              />
            </div>

            <button
              onClick={handleAddCustomer}
              className="w-full px-3 py-2 bg-green-500 text-white  text-sm font-medium hover:bg-green-600 transition flex items-center justify-center gap-2"
            >
              <PiPlus size={16} />
              Add Customer
            </button>
          </div>

          <div className="border-t pt-4">
            <div className="text-sm font-medium text-gray-700 mb-3">Existing Customers</div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {customers.length === 0 ? (
                <div className="text-xs text-gray-500 text-center py-4">No customers yet</div>
              ) : (
                customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="bg-gray-50 border border-gray-200  p-3 flex items-start justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-black text-sm">{customer.name}</div>
                      <div className="text-xs text-gray-600">{customer.category}</div>
                      {customer.phone && (
                        <div className="text-xs text-gray-600">{customer.phone}</div>
                      )}
                      {customer.email && (
                        <div className="text-xs text-gray-600 truncate">{customer.email}</div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="p-2 text-red-500 hover:bg-red-50  transition flex-shrink-0 ml-2"
                      aria-label={`Delete ${customer.name}`}
                      title="Delete customer"
                    >
                      <PiTrash size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
