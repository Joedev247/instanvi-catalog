"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PiTrash, PiPlus, PiArrowLeft } from "react-icons/pi";
import CreateCustomerModal from "../../components/CreateCustomerModal";
import GrantAccessModal from "../../components/GrantAccessModal";

type Customer = {
  id: string;
  name: string;
  email?: string;
  category?: string;
  createdAt: string;
  catalogAccess?: string[];
};

type Catalog = {
  id: string;
  name: string;
  category: string;
};

export default function Page() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [categories, setCategories] = useState<string[]>(["Wholesaler", "Retailer"]);
  const [modalOpen, setModalOpen] = useState(false);
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("instanvi_customers");
      if (raw) setCustomers(JSON.parse(raw));
    } catch (e) {}
    try {
      const rawCats = localStorage.getItem("instanvi_customer_categories");
      if (rawCats) setCategories(JSON.parse(rawCats));
    } catch (e) {}
    try {
      const rawCatalogs = localStorage.getItem("instanvi_catalogs");
      if (rawCatalogs) setCatalogs(JSON.parse(rawCatalogs));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("instanvi_customers", JSON.stringify(customers));
    } catch (e) {}
  }, [customers]);

  const handleCreate = (data: { name: string; email?: string; category?: string }) => {
    const id = `cu_${Date.now()}`;
    const obj: Customer = {
      id,
      name: data.name,
      email: data.email,
      category: data.category,
      createdAt: new Date().toISOString(),
      catalogAccess: [],
    };
    setCustomers((s) => [obj, ...s]);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this customer?")) return;
    setCustomers((s) => s.filter((c) => c.id !== id));
  };

  const handleOpenGrantModal = (customer: Customer) => {
    setActiveCustomer(customer);
    setGrantModalOpen(true);
  };

  const handleSaveAccess = (customerId: string, access: string[]) => {
    setCustomers((prev) => prev.map((c) => (c.id === customerId ? { ...c, catalogAccess: access } : c)));
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="p-2 text-gray-700 hover:bg-gray-200  transition"
              title="Back to Catalog"
            >
              <PiArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-black">Customers</h1>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold  transition"
          >
            <PiPlus size={20} />
            Create Customer
          </button>
        </div>

        {customers.length === 0 ? (
          <div className="bg-white  shadow p-8 text-center">
            <p className="text-gray-600 text-lg">No customers yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="bg-white  shadow overflow-hidden">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-semibold text-gray-900">Name</th>
                  <th className="p-3 text-left font-semibold text-gray-900">Email</th>
                  <th className="p-3 text-left font-semibold text-gray-900">Category</th>
                  <th className="p-3 text-left font-semibold text-gray-900">Catalogs</th>
                  <th className="p-3 text-right font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3 align-top text-gray-900">{customer.name}</td>
                    <td className="p-3 align-top text-gray-700">{customer.email || "—"}</td>
                    <td className="p-3 align-top text-gray-700">{customer.category || "—"}</td>
                    <td className="p-3 align-top text-gray-700">{(customer.catalogAccess || []).length} granted</td>
                    <td className="p-3 text-right align-top">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenGrantModal(customer)} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm  hover:bg-blue-200 transition">Catalogs</button>
                        <button onClick={() => handleDelete(customer.id)} className="px-3 py-1 text-sm border text-red-600 ">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateCustomerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
        categories={categories}
        catalogs={catalogs}
      />
      <GrantAccessModal
        open={grantModalOpen}
        onClose={() => setGrantModalOpen(false)}
        catalogs={catalogs}
        customer={activeCustomer}
        onSave={(id, access) => {
          handleSaveAccess(id, access);
          setGrantModalOpen(false);
        }}
      />
    </div>
  );
}
