"use client";
import React, { useEffect, useState } from "react";
import { PiX, PiShoppingCart, PiArrowLeftBold, PiArrowRightBold } from "react-icons/pi";

type Product = {
  id: string;
  name: string;
  priceMin: number;
  priceMax: number;
  img?: string;
  types: string[];
  category?: string;
};

export default function MenuModal({
  open,
  onClose,
  products,
  onAddToCart,
  categories = [],
  activeCategory = null,
}: {
  open: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product, type?: string) => void;
  categories?: string[];
  activeCategory?: string | null;
}) {
  const [selectedType, setSelectedType] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    if (open) setCurrentPage(1);
  }, [open]);

  useEffect(() => {
    if (open) {
      // prefer explicit activeCategory, else default to All
      setSelectedCategory(activeCategory || "All");
      setCurrentPage(1);
    }
  }, [open, activeCategory]);

  const handleAddClick = (product: Product) => {
    const type = selectedType[product.id] || product.types?.[0] || "";
    onAddToCart(product, type);
    setSelectedType((prev) => ({ ...prev, [product.id]: "" }));
  };

  const filtered = products.filter((p) =>
    !selectedCategory || selectedCategory === "All" ? true : p.category === selectedCategory
  );

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
            ${open ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}
            left-0 right-0 top-0 bottom-0 md:right-0 md:top-0 md:bottom-0 md:left-auto md:h-full md:w-1/2`}
          role="dialog"
          aria-modal="true"
        >
          <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-sm text-gray-600">Menu</div>
              <div className="text-lg font-semibold text-black">{products.length} Products</div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 text-gray-600 hover:bg-gray-100 transition"
            >
              <PiX size={24} />
            </button>
          </div>

            <div className="p-6">
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2 overflow-x-auto">
                <button
                  onClick={() => { setSelectedCategory("All"); setCurrentPage(1); }}
                  className={`px-3 py-1 text-sm font-medium transition-colors  ${selectedCategory === "All" ? "instanvi-chip-selected" : "bg-white text-gray-700 border border-gray-200"}`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setSelectedCategory(c); setCurrentPage(1); }}
                    className={`px-3 py-1 text-sm font-medium transition-colors  ${selectedCategory === c ? "instanvi-chip-selected" : "bg-white text-gray-700 border border-gray-200"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 "
                >
                  <div className="relative bg-gray-100 overflow-hidden h-32 sm:h-36">
                    <img
                      src={product.img || "https://via.placeholder.com/200"}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  <div className="p-4">
                    <div className="font-semibold text-black text-sm mb-1 truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{product.priceMin} - {product.priceMax} XAF</div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedType[product.id] || product.types?.[0] || ""}
                        onChange={(e) =>
                          setSelectedType((prev) => ({
                            ...prev,
                            [product.id]: e.target.value,
                          }))
                        }
                        className="flex-1 border border-gray-300 px-2 py-1 text-xs text-black"
                      >
                        {product.types?.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleAddClick(product)}
                        aria-label={`Add ${product.name}`}
                        className="ml-1 p-2 hover:bg-green-600 text-white -md flex items-center justify-center"
                      >
                        <PiShoppingCart size={16} className="text-green-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            <div className="mt-4 px-2 pb-6 flex flex-col sm:flex-row items-center sm:items-center gap-2 justify-between">
              <div className="text-xs text-gray-600">Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, products.length)} of {products.length}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 border text-gray-700  disabled:opacity-50"
                >
                  <PiArrowLeftBold size={14} />
                </button>

                <div className="text-xs text-gray-700">{currentPage} / {Math.max(1, Math.ceil(products.length / pageSize))}</div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil(products.length / pageSize)), p + 1))}
                  disabled={currentPage === Math.max(1, Math.ceil(products.length / pageSize))}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 border text-gray-700  disabled:opacity-50"
                >
                  <PiArrowRightBold size={14} />
                </button>
              </div>
            </div>
            </div>
            </div>
        </div>
      </div>
  );
}
