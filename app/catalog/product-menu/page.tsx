"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductDetailsModal from "../../../components/ProductDetailsModal";
import NewProductModal from "../../../components/NewProductModal";
import { FiEye, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { PiArrowLeft } from "react-icons/pi";

type Product = {
  id: string;
  name: string;
  priceMin: number;
  priceMax: number;
  img?: string;
  types: string[];
  category?: string;
  description?: string;
};

// Products are stored in localStorage under `instanvi_products`.
// Product Menu will initialize from that key and allow creating/editing products.

export default function ProductMenuPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const handleOpen = (p: Product) => {
    setSelected(p);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelected(null);
  };

  const handlePay = async (productId: string, type: string | undefined, quantity: number) => {
    console.log("Pay for", productId, type, quantity);
  };

  const handleCreate = (p: Omit<Product, 'id'> | any) => {
    if (selected) {
      // Edit mode: update existing product
      setProducts((s) => s.map((product) => (product.id === selected.id ? { ...product, ...p } : product)));
    } else {
      // Create mode: add new product
      const id = `p_${Date.now()}`;
      const newProduct: Product = { id, ...p };
      setProducts((s) => [newProduct, ...s]);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this product?")) return;
    setProducts((s) => s.filter((p) => p.id !== id));
  };

  const handleEdit = (p: Product) => {
    setSelected(p);
    setCreateOpen(true);
  };

  // load persisted products from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("instanvi_products");
      if (raw) setProducts(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  // persist products when they change
  useEffect(() => {
    try {
      localStorage.setItem("instanvi_products", JSON.stringify(products));
      try {
        window.dispatchEvent(new Event("instanvi_products_updated"));
      } catch (e) {}
    } catch (e) {
      // ignore
    }
  }, [products]);

  return (
    <div className="min-h-screen p-4 md:p-6 bg-white">
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
            <h1 className="text-2xl font-bold text-black">Product Menu</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-100 text-black px-4 py-2 transition text-sm">
              Go to Catalog
            </button>
            <button onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 bg-[var(--instanvi-primary)] hover:bg-[var(--instanvi-primary-600)] text-white px-3 py-2 ">
              <FiPlus />
              <span className="text-sm">Create New Product</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 ">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-700 font-medium">
                <tr>
                  <th className="text-left p-4">Image</th>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 align-top">
                      <div className="w-20 h-20 bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img src={p.img || "https://via.placeholder.com/80"} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-semibold text-black">{p.name}</div>
                      <div className="text-sm text-black">{p.category}</div>
                      <div className="text-sm text-gray-700 mt-1">{p.description}</div>
                    </td>
                    <td className="p-4 align-top">
                      <select className="border border-gray-300 px-3 py-1 text-black text-sm">
                        {p.types.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 align-top">
                      <div className="text-sm font-medium text-black">{p.priceMin} XAF</div>
                      {p.priceMax > p.priceMin && <div className="text-sm text-gray-500 line-through">{p.priceMax} XAF</div>}
                    </td>
                    <td className="p-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpen(p)} className="inline-flex items-center justify-center p-2 text-green-500 hover:bg-green-50 transition" aria-label={`View ${p.name}`}>
                          <FiEye />
                        </button>
                        <button onClick={() => handleEdit(p)} className="inline-flex items-center justify-center p-2 text-blue-500 hover:bg-blue-50 transition" aria-label={`Edit ${p.name}`}>
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="inline-flex items-center justify-center p-2 text-red-500 hover:bg-red-50 transition" aria-label={`Delete ${p.name}`}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>

      <ProductDetailsModal
        open={modalOpen}
        onClose={handleClose}
        product={selected}
        onPay={handlePay}
      />

      <NewProductModal 
        open={createOpen} 
        onClose={() => {
          setCreateOpen(false);
          setSelected(null);
        }} 
        onCreate={handleCreate}
        initialProduct={selected || undefined}
      />
    </div>
  );
}
