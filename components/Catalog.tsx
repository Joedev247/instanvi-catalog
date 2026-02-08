"use client";
import { useMemo, useState, useEffect } from "react";
import { PiList, PiPlus, PiTrash, PiMinus } from "react-icons/pi";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import ProductRow from "../components/ProductRow";
import NewCatalogModal from "./NewCatalogModal";
import Summary from "../components/Summary";
import MenuModal from "../components/MenuModal";
import CustomerModal from "../components/CustomerModal";

type Product = {
  id: string;
  name: string;
  priceMin: number;
  priceMax: number;
  img?: string;
  types: string[];
  category?: string;
};
const categoriesList = ["Drinks", "Export", "Color", "Price", "Popular"];

export default function Catalog() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tableCategory, setTableCategory] = useState<string>("All");
  const [cartCount, setCartCount] = useState(0);
  const [cartAmount, setCartAmount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [history, setHistory] = useState<Array<{id: string; name: string; price: number; img?: string; type?: string; quantity?: number; when: string; paid?: boolean}>>([]);
  const [productTypes, setProductTypes] = useState<{ [key: string]: string }>({});
  
  const [productsState, setProductsState] = useState<Product[]>([]);
  const [catalog, setCatalog] = useState<{ id: string; name: string; products: string[] } | null>(null);
  const [creating, setCreating] = useState(false);
  const [newCatalogName, setNewCatalogName] = useState("");
  const [duplicateTemplate, setDuplicateTemplate] = useState<null | { name?: string; category?: string | null; prices?: { [id: string]: { priceMin: number; priceMax?: number } } }>(null);
  const [customerCategories, setCustomerCategories] = useState<string[]>(["Wholesaler", "Retailer"]);
  const [selectedCustomerCategory, setSelectedCustomerCategory] = useState<string | null>(null);
  const [catalogs, setCatalogs] = useState<Array<{ id: string; name: string; category: string; prices: { [productId: string]: { priceMin: number; priceMax?: number } }; allowedCategories?: string[]; slug?: string }>>([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);
  const [editingPrices, setEditingPrices] = useState(false);

  // check if organization exists, redirect to setup if not
  useEffect(() => {
    try {
      const org = localStorage.getItem("instanvi_organization");
      if (!org) {
        router.push("/setup");
      }
    } catch (e) {
      router.push("/setup");
    }
  }, [router]);

  // load catalogs and customer categories
  useEffect(() => {
    try {
      const raw = localStorage.getItem("instanvi_catalogs");
      if (raw) {
        setCatalogs(JSON.parse(raw));
      } else {
        // fallback: check single catalog legacy key
        const legacy = localStorage.getItem("instanvi_catalog");
        if (legacy) {
          try {
            const lc = JSON.parse(legacy);
            const cobj = [{ id: lc.id || `c_${Date.now()}`, name: lc.name || lc.id || "Default", category: "Default", prices: {} }];
            setCatalogs(cobj);
            localStorage.setItem("instanvi_catalogs", JSON.stringify(cobj));
          } catch (e) {
            // ignore
          }
        }
      }
    } catch (e) {
      // ignore
    }

    try {
      const rawCats = localStorage.getItem("instanvi_customer_categories");
      if (rawCats) setCustomerCategories(JSON.parse(rawCats));
    } catch (e) {
      
      // ignore
    }
  }, []);

  // persist catalogs when changed
  useEffect(() => {
    try {
      localStorage.setItem("instanvi_catalogs", JSON.stringify(catalogs));
    } catch (e) {
      // ignore
    }
  }, [catalogs]);

  const [priceEdits, setPriceEdits] = useState<{ [productId: string]: { priceMin: number; priceMax: number } }>({});

  // load products from localStorage (saved by Product Menu page) on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("instanvi_products");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setProductsState(parsed);
          } else {
            setProductsState([]);
          }
        } catch (e) {
          setProductsState([]);
        }
      } else {
        setProductsState([]);
      }
    } catch (e) {
      setProductsState([]);
    }
  }, []);

  // listen for product updates from other components/pages
  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem("instanvi_products");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setProductsState(parsed);
        }
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener("instanvi_products_updated", handler);
    // also handle native storage events (other tabs)
    const storageHandler = (ev: StorageEvent) => {
      if (ev.key === "instanvi_products") handler();
    };
    window.addEventListener("storage", storageHandler);
    return () => {
      window.removeEventListener("instanvi_products_updated", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  // persist cart history when changed
  useEffect(() => {
    try {
      localStorage.setItem("instanvi_cart_history", JSON.stringify(history));
    } catch (e) {
      // ignore
    }
  }, [history]);

  // load catalog (user-created) on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("instanvi_catalog");
      if (raw) setCatalog(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  // ensure there's a default catalog that mirrors the Product Menu products
  useEffect(() => {
    try {
      if ((catalogs || []).length === 0 && (productsState || []).length > 0) {
        const id = "c_product_menu";
        const prices: any = {};
        productsState.forEach((p) => {
          prices[p.id] = { priceMin: p.priceMin, priceMax: p.priceMax };
        });
        const obj = { id, name: "Product Menu", category: "Default", prices, slug: "product-menu" };
        setCatalogs([obj]);
        setSelectedCatalogId(id);
      } else {
        const exists = (catalogs || []).some((c) => c.id === "c_product_menu");
        if (!exists && (productsState || []).length > 0) {
          const id = "c_product_menu";
          const prices: any = {};
          productsState.forEach((p) => {
            prices[p.id] = { priceMin: p.priceMin, priceMax: p.priceMax };
          });
          const obj = { id, name: "Product Menu", category: "Default", prices, slug: "product-menu" };
          setCatalogs((s) => [obj, ...s]);
          setSelectedCatalogId(id);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [catalogs, productsState]);

  const products = useMemo(() => {
    return productsState.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  }, [query, productsState]);

  const filteredByCategory = useMemo(() => {
    if (tableCategory === "All") {
      return products;
    }
    return products.filter((p) => p.category === tableCategory);
  }, [products, tableCategory]);

  // compute view products using selected catalog price overrides (if any)
  const selectedCatalog = useMemo(() => catalogs.find((c) => c.id === selectedCatalogId) || null, [catalogs, selectedCatalogId]);

  const viewProducts = useMemo(() => {
    if (!selectedCatalog) return products;
    return products.map((p) => {
      const override = selectedCatalog.prices?.[p.id];
      if (!override) return p;
      return { ...p, priceMin: override.priceMin ?? p.priceMin, priceMax: override.priceMax ?? p.priceMax };
    });
  }, [products, selectedCatalog]);

  const filteredViewByCategory = useMemo(() => {
    if (tableCategory === "All") return viewProducts;
    return viewProducts.filter((p) => p.category === tableCategory);
  }, [viewProducts, tableCategory]);

  // When a customer category is selected (Wholesaler/Retailer/Other), show products from the catalog
  // that matches that customer category. If none found, return empty array so UI can show a message.
  const displayProducts = useMemo(() => {
    if (!selectedCustomerCategory) return filteredViewByCategory;

    // 'Other' should display the default product menu catalog (c_product_menu) if available
    if (selectedCustomerCategory === "Other") {
      const def = catalogs.find((c) => c.id === "c_product_menu");
      if (!def) return []; // no default catalog
      const ids = Object.keys(def.prices || {});
      const list = ids
        .map((id) => {
          const p = products.find((pp) => pp.id === id);
          if (!p) return null;
          const override = def.prices?.[id];
          return { ...p, priceMin: override?.priceMin ?? p.priceMin, priceMax: override?.priceMax ?? p.priceMax };
        })
        .filter(Boolean) as Product[];
      return list;
    }

    // find a catalog matching this customer category
    const cat = catalogs.find((c) => c.category === selectedCustomerCategory || (c.allowedCategories || []).includes(selectedCustomerCategory));
    if (!cat) return [];
    const ids = Object.keys(cat.prices || {});
    const list = ids
      .map((id) => {
        const p = products.find((pp) => pp.id === id);
        if (!p) return null;
        const override = cat.prices?.[id];
        return { ...p, priceMin: override?.priceMin ?? p.priceMin, priceMax: override?.priceMax ?? p.priceMax };
      })
      .filter(Boolean) as Product[];
    return list;
  }, [selectedCustomerCategory, catalogs, products, filteredViewByCategory]);

  function handleAdd(product: Product, selectedType?: string, qty: number = 1) {
    const type = selectedType || productTypes[product.id] || product.types?.[0] || "";
    const price = product.priceMin || 0;
    setCartCount((c) => c + 1);
    setCartAmount((a) => a + price * qty);
    const entry = { id: product.id, name: product.name, price, img: product.img, type, quantity: qty, when: new Date().toISOString(), paid: false };
    setHistory((h) => [entry, ...h]);
  }

  function getHistoryItem(productId: string) {
    return history.find((h) => h.id === productId);
  }

  function handleUpdateQuantity(productId: string, newQuantity: number) {
    if (newQuantity > 0) {
      setHistory((h) => h.map((it) => (it.id === productId ? { ...it, quantity: newQuantity } : it)));
    }
  }

  function handleDeleteFromCart(productId: string) {
    const item = getHistoryItem(productId);
    if (item) {
      setHistory((h) => h.filter((it) => it.id !== productId));
    }
  }

  function handleDelete(when: string) {
    setHistory((h) => h.filter((it) => it.when !== when));
  }

  function handleClear() {
    setHistory([]);
  }

  function handlePay(when: string) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setHistory((h) => h.map((it) => (it.when === when ? { ...it, paid: true } : it)));
        resolve();
      }, 900);
    });
  }

  function handleCreateCatalog() {
    if (!newCatalogName.trim()) return;
    const id = `c_${Date.now()}`;
    const categoryFor = selectedCustomerCategory || "Default";
    const slug = `${newCatalogName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Math.random().toString(36).slice(2,7)}`;
    const obj: any = { id, name: newCatalogName.trim(), category: categoryFor, prices: {}, slug };
    setCatalogs((s) => [obj, ...s]);
    setSelectedCatalogId(id);
    setNewCatalogName("");
    setCreating(false);
  }

  function handleDuplicateCatalog() {
    try {
      if (selectedCatalog) {
        const id = `c_${Date.now()}`;
        const slug = `${selectedCatalog.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Math.random().toString(36).slice(2,7)}`;
        const copy = { ...selectedCatalog, id, name: `${selectedCatalog.name} Copy`, slug };
        setCatalogs((s) => [copy, ...s]);
        setSelectedCatalogId(id);
        return;
      }

      // no selected catalog -> create one from current products
      if ((productsState || []).length > 0) {
        const id = `c_${Date.now()}`;
        const prices: any = {};
        productsState.forEach((p) => {
          prices[p.id] = { priceMin: p.priceMin, priceMax: p.priceMax };
        });
        const slug = `product-menu-copy-${Math.random().toString(36).slice(2,7)}`;
        const obj = { id, name: `Product Menu Copy`, category: "Default", prices, slug };
        setCatalogs((s) => [obj, ...s]);
        setSelectedCatalogId(id);
      }
    } catch (e) {
      // ignore
    }
  }

  function handleCheckout() {
    try {
      router.push("/checkout");
    } catch (e) {
      // ignore
    }
  }

  // when a customer category is selected, try to auto-select a matching catalog
  useEffect(() => {
    if (!selectedCustomerCategory) {
      if (!selectedCatalogId && catalogs.length > 0) setSelectedCatalogId(catalogs[0].id);
      return;
    }
    const match = catalogs.find((c) => (c.category === selectedCustomerCategory) || (c.allowedCategories || []).includes(selectedCustomerCategory));
    if (match) {
      setSelectedCatalogId(match.id);
    } else if (catalogs.length > 0) {
      setSelectedCatalogId(catalogs[0].id);
    }
  }, [selectedCustomerCategory, catalogs]);

  // Check if customer is accessing from shared link and auto-select their catalog
  useEffect(() => {
    try {
      const customerAccessData = localStorage.getItem("instanvi_customer_catalog_access");
      if (customerAccessData) {
        const data = JSON.parse(customerAccessData);
        // Auto-select the catalog that matches their access
        if (data.catalogId && catalogs.length > 0) {
          const foundCatalog = catalogs.find((c) => c.id === data.catalogId);
          if (foundCatalog) {
            setSelectedCatalogId(data.catalogId);
            setSelectedCustomerCategory(data.category || null);
          }
        }
        // Clear this after use so it doesn't persist on refresh
        localStorage.removeItem("instanvi_customer_catalog_access");
      }
    } catch (e) {
      // ignore
    }
  }, [catalogs]);
  
  return (
    <div className="min-h-screen p-3 md:p-6 bg-white">
      <div className="max-w-md md:max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl md:text-2xl font-semibold text-black">Catalog</h1>
          <div className="flex items-center gap-3">
      <p className="text-xs md:text-sm text-gray-600">{cartCount} items in cart</p>
            <button
              onClick={() => {
                try {
                  const c = selectedCatalog;
                  if (!c || !c.slug) return alert("No catalog selected to share");
                  const url = `${location.origin}/catalog/share/${c.slug}`;
                  navigator.clipboard?.writeText(url);
                  alert("Share link copied to clipboard:\n" + url);
                } catch (e) {
                  alert("Unable to copy link");
                }
              }}
              className="text-sm px-3 py-1 text-black border border-gray-200  hover:bg-gray-50"
            >
              Share
            </button>
          </div>
        </div>

        <div className="flex mb-4">
          <SearchBar
            value={query}
            onChange={(v) => setQuery(v)}
            onSettings={() => router.push("/customers")}
            onDuplicate={() => {
              if (selectedCatalog) {
                const prices: any = {};
                Object.keys(selectedCatalog.prices || {}).forEach((id) => {
                  prices[id] = selectedCatalog.prices[id];
                });
                setDuplicateTemplate({ name: `${selectedCatalog.name} Copy`, category: selectedCatalog.category, prices });
              } else {
                // use current products prices as base
                const prices: any = {};
                productsState.forEach((p) => (prices[p.id] = { priceMin: p.priceMin, priceMax: p.priceMax ?? p.priceMin }));
                setDuplicateTemplate({ name: `New Catalog`, category: selectedCustomerCategory ?? null, prices });
              }
              setCreating(true);
            }}
            onProductMenu={() => router.push("/catalog/product-menu")}
            categories={customerCategories}
            selectedCategory={selectedCustomerCategory}
            onCategoryChange={(cat) => setSelectedCustomerCategory(cat)}
          />
        </div>

        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex gap-1 md:gap-2 flex-wrap overflow-x-auto flex-1">
            {["All", ...categoriesList].map((c) => (
              <button
                key={c}
                onClick={() => { setTableCategory(c); }}
                className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium transition-colors border whitespace-nowrap
                  ${tableCategory === c ? "instanvi-chip-selected border-transparent" :
                    "bg-white text-gray-700 border-gray-200"}`}
              >
                {c}
              </button>
            ))}
          </div>

          
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white shadow overflow-hidden ">
          <table className="w-full table-fixed">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 md:p-4 text-left text-black font-semibold text-sm">Product</th>
                <th className="p-3 md:p-4 text-left text-black font-semibold text-sm">Name / Price</th>
                <th className="p-3 md:p-4 text-left text-black font-semibold text-sm">Type</th>
                <th className="p-3 md:p-4 text-right text-black font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500 text-sm">
                    {selectedCustomerCategory ? (
                      <div className="flex flex-col items-center gap-3">
                        <span>The catalog for "{selectedCustomerCategory}" is empty.</span>
                        <button
                          onClick={() => {
                            const prices: any = {};
                            products.forEach((p) => (prices[p.id] = { priceMin: p.priceMin, priceMax: p.priceMax ?? p.priceMin }));
                            setDuplicateTemplate({ name: `${selectedCustomerCategory} Catalog`, category: selectedCustomerCategory, prices });
                            setCreating(true);
                          }}
                          className="mt-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
                        >
                          Create catalog for {selectedCustomerCategory}
                        </button>
                      </div>
                    ) : (
                      <span>No products found.</span>
                    )}
                  </td>
                </tr>
              ) : (
                displayProducts.map((product) => {
                  const cartItem = getHistoryItem(product.id);
                  if (cartItem) {
                    return (
                      <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="p-3 md:p-4">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100  overflow-hidden">
                            <img
                              src={product.img || "https://via.placeholder.com/200"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="font-semibold text-black text-sm">{product.name}</div>
                          {!editingPrices ? (
                            <div className="text-xs text-gray-600">{product.priceMin} - {product.priceMax} XAF</div>
                          ) : (
                            <div className="flex gap-2">
                              <input type="number" value={priceEdits[product.id]?.priceMin ?? product.priceMin} onChange={(e) => setPriceEdits((prev) => ({ ...prev, [product.id]: { priceMin: Number(e.target.value || 0), priceMax: prev[product.id]?.priceMax ?? product.priceMax } }))} className="border px-2 py-1 w-24" />
                              <input type="number" value={priceEdits[product.id]?.priceMax ?? product.priceMax} onChange={(e) => setPriceEdits((prev) => ({ ...prev, [product.id]: { priceMin: prev[product.id]?.priceMin ?? product.priceMin, priceMax: Number(e.target.value || 0) } }))} className="border px-2 py-1 w-24" />
                            </div>
                          )}
                        </td>
                        <td className="p-3 md:p-4">
                          <select
                            value={productTypes[product.id] || product.types?.[0] || ""}
                            onChange={(e) => setProductTypes((prev) => ({ ...prev, [product.id]: e.target.value }))}
                            className="border border-gray-300 px-2 py-1  text-xs text-gray-700 bg-white w-full md:w-auto"
                          >
                            {product.types?.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3 md:p-4 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <div className="flex items-center gap-0 border border-gray-300 ">
                              <button
                                onClick={() => handleUpdateQuantity(product.id, Math.max(1, (cartItem.quantity || 1) - 1))}
                                className="p-1 text-gray-600 hover:bg-gray-100"
                                aria-label="Decrease quantity"
                                title="Decrease"
                              >
                                <PiMinus size={12} />
                              </button>
                              <input
                                id={`cart-qty-${product.id}`}
                                type="number"
                                min={1}
                                value={cartItem.quantity || 1}
                                onChange={(e) => handleUpdateQuantity(product.id, Math.max(1, parseInt(e.target.value) || 1))}className="w-10 h-5 text-center border-0 text-black font-medium outline-none [&::-webkit-outer-spin-button]:[appearance:none] [&::-webkit-inner-spin-button]:[appearance:none] [&]:[appearance:textfield]"
                                aria-label={`Quantity for ${product.name}`}
                                title="Quantity"
                              />
                              <button
                                onClick={() => handleUpdateQuantity(product.id, (cartItem.quantity || 1) + 1)}
                                className="p-1 text-gray-600 hover:bg-gray-100"
                                aria-label="Increase quantity"
                                title="Increase"
                              >
                                <PiPlus size={12} />
                              </button>
                            </div>
                            <button
                              onClick={() => handleDeleteFromCart(product.id)}
                              title="Remove"
                              className="p-2 text-red-500 hover:bg-red-50  transition"
                            >
                              <PiTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onAdd={handleAdd}
                      editing={editingPrices && !!selectedCatalog}
                      priceEdit={priceEdits[product.id]}
                      onPriceChange={(id, min, max) => setPriceEdits((prev) => ({ ...prev, [id]: { priceMin: min, priceMax: max } }))}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        

        {/* Pagination removed - showing full list */}

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {displayProducts.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm bg-white ">
              {selectedCustomerCategory ? (
                <div className="flex flex-col items-center gap-3">
                  <div>The catalog for "{selectedCustomerCategory}" is empty.</div>
                  <button
                    onClick={() => {
                      const prices: any = {};
                      products.forEach((p) => (prices[p.id] = { priceMin: p.priceMin, priceMax: p.priceMax ?? p.priceMin }));
                      setDuplicateTemplate({ name: `${selectedCustomerCategory} Catalog`, category: selectedCustomerCategory, prices });
                      setCreating(true);
                    }}
                    className="mt-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
                  >
                    Create catalog for {selectedCustomerCategory}
                  </button>
                </div>
              ) : (
                <div>No products found.</div>
              )}
            </div>
          ) : (
            displayProducts.map((product) => {
              const cartItem = getHistoryItem(product.id);
              return (
                <div key={product.id} className="bg-white  p-3 shadow-sm border border-gray-200">
                  <div className="flex gap-3 items-start">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gray-100  overflow-hidden">
                        <img
                          src={product.img || "https://via.placeholder.com/200"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Product Info - Center */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-black text-sm truncate">{product.name}</div>
                      {!editingPrices ? (
                        <div className="text-xs text-gray-600">{product.priceMin} - {product.priceMax} XAF</div>
                      ) : (
                        <div className="flex gap-2">
                          <input type="number" value={priceEdits[product.id]?.priceMin ?? product.priceMin} onChange={(e) => setPriceEdits((prev) => ({ ...prev, [product.id]: { priceMin: Number(e.target.value || 0), priceMax: prev[product.id]?.priceMax ?? product.priceMax } }))} className="border px-2 py-1 w-20" />
                          <input type="number" value={priceEdits[product.id]?.priceMax ?? product.priceMax} onChange={(e) => setPriceEdits((prev) => ({ ...prev, [product.id]: { priceMin: prev[product.id]?.priceMin ?? product.priceMin, priceMax: Number(e.target.value || 0) } }))} className="border px-2 py-1 w-20" />
                        </div>
                      )}
                      {cartItem && (
                        <div className="mt-2 flex items-center gap-2 border border-gray-300  w-fit">
                          <button
                            onClick={() => handleUpdateQuantity(product.id, Math.max(1, (cartItem.quantity || 1) - 1))}
                            className="p-1 text-gray-600 hover:bg-gray-100"
                            aria-label="Decrease quantity"
                            title="Decrease"
                          >
                            <PiMinus size={14} />
                          </button>
                          <input
                            id={`cart-qty-mobile-${product.id}`}
                            type="number"
                            min={1}
                            value={cartItem.quantity || 1}
                            onChange={(e) => handleUpdateQuantity(product.id, Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-10 h-5 text-center border-0 text-black font-medium text-xs outline-none [&::-webkit-outer-spin-button]:[appearance:none] [&::-webkit-inner-spin-button]:[appearance:none] [&]:[appearance:textfield]"
                            aria-label={`Quantity for ${product.name}`}
                            title="Quantity"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(product.id, (cartItem.quantity || 1) + 1)}
                            className="p-1 text-gray-600 hover:bg-gray-100"
                            aria-label="Increase quantity"
                            title="Increase"
                          >
                            <PiPlus size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right side: dropdown and action button */}
                    <div className="flex flex-col items-end gap-2">
                      <select
                        value={productTypes[product.id] || product.types?.[0] || ""}
                        onChange={(e) => setProductTypes((prev) => ({ ...prev, [product.id]: e.target.value }))}
                        className="border border-gray-300 px-2 py-1  text-xs text-gray-700 bg-white min-w-[80px]"
                      >
                        {product.types?.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>

                      {cartItem ? (
                        <button
                          onClick={() => handleDeleteFromCart(product.id)}
                          title="Remove"
                          className="p-2 text-red-500 hover:bg-red-50  transition"
                        >
                          <PiTrash size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAdd(product, productTypes[product.id])}
                          title="Add to Cart"
                          className="p-2 text-green-500 hover:bg-green-50  transition"
                        >
                          <PiPlus size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Mobile pagination removed - full list shown */}

        <div className="mt-6">
          <Summary
            totalProducts={cartCount}
            totalAmount={cartAmount}
            history={history}
            onDelete={handleDelete}
            onClear={handleClear}
            onPay={handlePay}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      <MenuModal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        products={viewProducts}
        categories={categoriesList}
        activeCategory={category}
        onAddToCart={handleAdd}
      />

      <CustomerModal
        open={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
      />

      <NewCatalogModal
        open={creating}
        initial={duplicateTemplate}
        onClose={() => {
          setCreating(false);
          setDuplicateTemplate(null);
        }}
        products={productsState}
        categories={customerCategories}
        onCreate={(payload) => {
          const id = `c_${Date.now()}`;
          const slug = `${payload.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Math.random().toString(36).slice(2,7)}`;
          const obj: any = { id, name: payload.name, category: payload.category || "Default", prices: payload.prices, allowedCategories: payload.category ? [payload.category] : [], slug };

          // update master products prices so Product Menu reflects edited prices
          try {
            const updated = productsState.map((p) => {
              const edit = payload.prices?.[p.id];
              if (!edit) return p;
              return { ...p, priceMin: Number(edit.priceMin) || p.priceMin, priceMax: Number(edit.priceMax ?? edit.priceMin) || p.priceMax };
            });
            setProductsState(updated);
            // products persistence handled by productsState effect
          } catch (e) {
            // ignore
          }

          setCatalogs((s) => [obj, ...s]);
          setSelectedCatalogId(id);
        }}
      />
    </div>
  );
}
