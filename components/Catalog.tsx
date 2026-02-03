"use client";
import { useMemo, useState } from "react";
import { PiList, PiTrash, PiEye } from "react-icons/pi";
import SearchBar from "./SearchBar";
import ProductRow from "../components/ProductRow";
import Summary from "../components/Summary";
import MenuModal from "../components/MenuModal";
import ProductDetailsModal from "../components/ProductDetailsModal";

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

const SAMPLE: Product[] = [
  { id: "p1", name: "Colacola", priceMin: 2000, priceMax: 2500, img: "https://via.placeholder.com/200?text=Cola+1", types: ["Bottle", "Can"], category: "Drinks" },
  { id: "p2", name: "Top Aroma", priceMin: 1000, priceMax: 1500, img: "https://via.placeholder.com/200?text=Aroma+2", types: ["Pack", "Single"], category: "Export" },
  { id: "p3", name: "Sparkle Water", priceMin: 500, priceMax: 750, img: "https://via.placeholder.com/200?text=Sparkle+3", types: ["Glass", "Bottle"], category: "Color" },
  { id: "p4", name: "Lemon Twist", priceMin: 600, priceMax: 900, img: "https://via.placeholder.com/200?text=Lemon+4", types: ["Bottle", "Can"], category: "Price" },
  { id: "p5", name: "Ginger Ale", priceMin: 1200, priceMax: 1600, img: "https://via.placeholder.com/200?text=Ginger+5", types: ["Bottle", "Can"], category: "Popular" },
  { id: "p6", name: "Tropical Mix", priceMin: 1800, priceMax: 2200, img: "https://via.placeholder.com/200?text=Tropical+6", types: ["Pack", "Single"], category: "Drinks" },
  { id: "p7", name: "Orange Splash", priceMin: 700, priceMax: 1000, img: "https://via.placeholder.com/200?text=Orange+7", types: ["Bottle", "Carton"], category: "Export" },
  { id: "p8", name: "Mango Delight", priceMin: 1500, priceMax: 1900, img: "https://via.placeholder.com/200?text=Mango+8", types: ["Bottle", "Single"], category: "Color" },
  { id: "p9", name: "Iced Tea", priceMin: 800, priceMax: 1100, img: "https://via.placeholder.com/200?text=IcedTea+9", types: ["Bottle", "Can"], category: "Price" },
  { id: "p10", name: "Berry Rush", priceMin: 900, priceMax: 1300, img: "https://via.placeholder.com/200?text=Berry+10", types: ["Pack", "Single"], category: "Popular" },
  { id: "p11", name: "Pure Spring", priceMin: 400, priceMax: 600, img: "https://via.placeholder.com/200?text=Spring+11", types: ["Glass", "Bottle"], category: "Drinks" },
  { id: "p12", name: "Energy Max", priceMin: 2500, priceMax: 3000, img: "https://via.placeholder.com/200?text=Energy+12", types: ["Can", "Pack"], category: "Export" },
  { id: "p13", name: "Citrus Blast", priceMin: 1100, priceMax: 1400, img: "https://via.placeholder.com/200?text=Citrus+13", types: ["Bottle", "Can"], category: "Color" },
  { id: "p14", name: "Herbal Sip", priceMin: 950, priceMax: 1250, img: "https://via.placeholder.com/200?text=Herbal+14", types: ["Pack", "Single"], category: "Price" },
  { id: "p15", name: "Coffee Cold", priceMin: 1400, priceMax: 1700, img: "https://via.placeholder.com/200?text=Coffee+15", types: ["Bottle", "Can"], category: "Popular" },
  { id: "p16", name: "Vanilla Cream", priceMin: 1300, priceMax: 1600, img: "https://via.placeholder.com/200?text=Vanilla+16", types: ["Pack", "Single"], category: "Drinks" },
  { id: "p17", name: "Sour Cherry", priceMin: 1250, priceMax: 1550, img: "https://via.placeholder.com/200?text=Cherry+17", types: ["Bottle", "Can"], category: "Export" },
  { id: "p18", name: "Pineapple Joy", priceMin: 1150, priceMax: 1450, img: "https://via.placeholder.com/200?text=Pineapple+18", types: ["Bottle", "Single"], category: "Color" },
  { id: "p19", name: "Apple Crisp", priceMin: 800, priceMax: 1050, img: "https://via.placeholder.com/200?text=Apple+19", types: ["Glass", "Bottle"], category: "Price" },
  { id: "p20", name: "Lime Zing", priceMin: 650, priceMax: 900, img: "https://via.placeholder.com/200?text=Lime+20", types: ["Can", "Bottle"], category: "Popular" },
  { id: "p21", name: "Coconut Wave", priceMin: 1700, priceMax: 2100, img: "https://via.placeholder.com/200?text=Coconut+21", types: ["Pack", "Single"], category: "Drinks" },
  { id: "p22", name: "Mint Cooler", priceMin: 700, priceMax: 950, img: "https://via.placeholder.com/200?text=Mint+22", types: ["Bottle", "Can"], category: "Export" },
  { id: "p23", name: "Spiced Cola", priceMin: 2100, priceMax: 2600, img: "https://via.placeholder.com/200?text=Spiced+23", types: ["Bottle", "Can"], category: "Color" },
  { id: "p24", name: "Tonic Water", priceMin: 600, priceMax: 850, img: "https://via.placeholder.com/200?text=Tonic+24", types: ["Glass", "Bottle"], category: "Price" },
  { id: "p25", name: "Sparkling Berry", priceMin: 980, priceMax: 1280, img: "https://via.placeholder.com/200?text=SparkleB+25", types: ["Pack", "Single"], category: "Popular" },
  { id: "p26", name: "Grape Soda", priceMin: 900, priceMax: 1200, img: "https://via.placeholder.com/200?text=Grape+26", types: ["Bottle", "Can"], category: "Drinks" },
  { id: "p27", name: "Herb Tonic", priceMin: 1500, priceMax: 1850, img: "https://via.placeholder.com/200?text=Herb+27", types: ["Bottle", "Single"], category: "Export" },
  { id: "p28", name: "Peach Punch", priceMin: 1100, priceMax: 1400, img: "https://via.placeholder.com/200?text=Peach+28", types: ["Pack", "Single"], category: "Color" },
  { id: "p29", name: "Berry Fusion", priceMin: 1000, priceMax: 1350, img: "https://via.placeholder.com/200?text=BerryF+29", types: ["Bottle", "Can"], category: "Price" },
  { id: "p30", name: "Cranberry Pop", priceMin: 1200, priceMax: 1500, img: "https://via.placeholder.com/200?text=Cran+30", types: ["Bottle", "Single"], category: "Popular" },
  { id: "p31", name: "Lemonade Classic", priceMin: 500, priceMax: 800, img: "https://via.placeholder.com/200?text=Lemonade+31", types: ["Glass", "Bottle"], category: "Drinks" },
  { id: "p32", name: "Cola Zero", priceMin: 1900, priceMax: 2300, img: "https://via.placeholder.com/200?text=ColaZero+32", types: ["Can", "Bottle"], category: "Export" },
  { id: "p33", name: "Iced Mocha", priceMin: 1600, priceMax: 2000, img: "https://via.placeholder.com/200?text=Mocha+33", types: ["Bottle", "Can"], category: "Color" },
  { id: "p34", name: "Vanilla Chill", priceMin: 1250, priceMax: 1550, img: "https://via.placeholder.com/200?text=Vanilla+34", types: ["Pack", "Single"], category: "Price" },
  { id: "p35", name: "Herbal Spark", priceMin: 1350, priceMax: 1650, img: "https://via.placeholder.com/200?text=Herbal+35", types: ["Bottle", "Can"], category: "Popular" },
  { id: "p36", name: "Berry Zest", priceMin: 950, priceMax: 1250, img: "https://via.placeholder.com/200?text=BerryZ+36", types: ["Pack", "Single"], category: "Drinks" },
];

export default function Catalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tableCategory, setTableCategory] = useState<string>("All");
  const [cartCount, setCartCount] = useState(0);
  const [cartAmount, setCartAmount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [history, setHistory] = useState<Array<{id: string; name: string; price: number; img?: string; type?: string; quantity?: number; when: string; paid?: boolean}>>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsEntry, setDetailsEntry] = useState<{
    id: string; name: string; price: number; img?: string; type?: string; quantity?: number; when: string; paid?: boolean
  } | null>(null);

  const products = useMemo(() => {
    return SAMPLE.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  function handleAdd(product: Product, selectedType?: string, qty: number = 1) {
    const price = product.priceMin || 0;
    setCartCount((c) => c + 1);
    setCartAmount((a) => a + price);
    const entry = { id: product.id, name: product.name, price, img: product.img, type: selectedType, quantity: qty, when: new Date().toISOString(), paid: false };
    setHistory((h) => [entry, ...h]);
  }

  function handleDelete(when: string) {
    setHistory((h) => h.filter((it) => it.when !== when));
  }

  function handleUpdateType(when: string, newType: string) {
    setHistory((h) => h.map((it) => (it.when === when ? { ...it, type: newType } : it)));
  }

  function handleUpdateQuantity(when: string, newQuantity: number) {
    if (newQuantity > 0) {
      setHistory((h) => h.map((it) => (it.when === when ? { ...it, quantity: newQuantity } : it)));
    }
  }

  function handleClear() {
    setHistory([]);
  }

  function handlePay(when: string) {
    return new Promise<void>((resolve) => {
      // simulate payment processing delay
      setTimeout(() => {
        setHistory((h) => h.map((it) => (it.when === when ? { ...it, paid: true } : it)));
        resolve();
      }, 900);
    });
  }

  function handleInstantPay(productId: string, type?: string, quantity: number = 1) {
    const product = SAMPLE.find((p) => p.id === productId);
    if (!product) return Promise.resolve();
    const price = (product.priceMin || 0) * quantity;
    const when = new Date().toISOString();
    setCartCount((c) => c + 1);
    setCartAmount((a) => a + price);
    const entry = { id: product.id, name: product.name, price, img: product.img, type, quantity, when, paid: true };
    setHistory((h) => [entry, ...h]);
    return Promise.resolve();
  }

  return (
    <div className="min-h-screen p-3 md:p-6 bg-gray-50">
      <div className="max-w-md md:max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl md:text-2xl font-semibold text-black">Catalog</h1>
          <p className="text-xs md:text-sm text-gray-600">{cartCount} items in cart</p>
        </div>

        <div className="mb-4">
          <SearchBar
            value={query}
            onChange={(v) => setQuery(v)}
            onSettings={() => setMenuOpen(true)}
          />
        </div>

        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex gap-1 md:gap-2 flex-wrap overflow-x-auto flex-1">
            {["All", ...categoriesList].map((c) => (
                <button
                  key={c}
                  onClick={() => setTableCategory(c)}
                  className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium transition-colors border whitespace-nowrap
                    ${tableCategory === c ? "instanvi-chip-selected border-transparent" :
                      "bg-white text-gray-700 border-gray-200"}`}
                >
                  {c}
                </button>
              ))}
          </div>

          <button
            aria-label="Menu"
            className="p-2 md:p-3 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition text-gray-700 flex-shrink-0"
            onClick={() => setMenuOpen(true)}
            title="Browse all products"
          >
            <PiList  size={18} md={{ size: 20 } as any} className="text-green-600"/>
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white shadow overflow-hidden rounded">
          <table className="w-full table-fixed">
            <thead className="bg-white">
              <tr>
                <th className="p-3 md:p-4 text-left text-black font-semibold text-sm">Product</th>
                <th className="p-3 md:p-4 text-left text-black font-semibold text-sm">Name / Price</th>
                <th className="p-3 md:p-4 text-left text-black font-semibold text-sm">Type</th>
                <th className="p-3 md:p-4 text-center text-black font-semibold text-sm">Quantity</th>
                <th className="p-3 md:p-4 text-right text-black font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filtered = tableCategory === "All" 
                  ? history 
                  : history.filter((item) => {
                      const product = SAMPLE.find((p) => p.id === item.id);
                      return product?.category === tableCategory;
                    });
                
                const searchFiltered = query
                  ? filtered.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
                  : filtered;
                
                if (searchFiltered.length === 0) {
                  return (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-500 text-sm">
                        No products selected. Use the menu to add items.
                      </td>
                    </tr>
                  );
                }
                
                return searchFiltered.map((item) => {
                  const product = SAMPLE.find((p) => p.id === item.id);
                  if (!product) return null;
                  return (
                    <tr key={item.when} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-3 md:p-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={item.img || "https://via.placeholder.com/200"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-3 md:p-4">
                        <div className="font-semibold text-black text-sm">{item.name}</div>
                        <div className="text-xs text-gray-600">{item.price} XAF</div>
                      </td>
                      <td className="p-3 md:p-4">
                        <select
                          value={item.type || ""}
                          onChange={(e) => handleUpdateType(item.when, e.target.value)}
                          className="border border-gray-300 px-2 py-1 rounded text-xs text-gray-700 bg-white w-full md:w-auto"
                        >
                          <option value="">Select Type</option>
                          {product.types?.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 md:p-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.when, (item.quantity || 1) - 1)}
                            className="px-1 md:px-2 py-1 bg-gray-200 text-black hover:bg-gray-300 rounded text-xs font-medium transition"
                          >
                            −
                          </button>
                          <span className="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded text-black font-medium text-xs">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.when, (item.quantity || 1) + 1)}
                            className="px-1 md:px-2 py-1 bg-gray-200 text-black hover:bg-gray-300 rounded text-xs font-medium transition"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-3 md:p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title="View"
                            onClick={() => { setDetailsEntry(item); setDetailsOpen(true); }}
                            className="p-1 md:p-2 text-blue-500 hover:bg-blue-50 rounded transition"
                          >
                            <PiEye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.when)}
                            title="Remove"
                            className="p-1 md:p-2 text-red-500 hover:bg-red-50 rounded transition"
                          >
                            <PiTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {(() => {
            const filtered = tableCategory === "All" 
              ? history 
              : history.filter((item) => {
                  const product = SAMPLE.find((p) => p.id === item.id);
                  return product?.category === tableCategory;
                });
            
            const searchFiltered = query
              ? filtered.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
              : filtered;
            
            if (searchFiltered.length === 0) {
              return (
                <div className="p-4 text-center text-gray-500 text-sm bg-white rounded">
                  No products selected. Use the menu to add items.
                </div>
              );
            }
            
            return searchFiltered.map((item) => {
              const product = SAMPLE.find((p) => p.id === item.id);
              if (!product) return null;
              return (
                <div key={item.when} className="bg-white  p-3 shadow-sm border border-gray-200">
                  <div className="flex gap-3 items-start">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={item.img || "https://via.placeholder.com/200"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Product Info - Center */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-black text-sm truncate">{item.name}</div>
                      <div className="text-xs text-gray-600">{item.price} XAF</div>

                      {/* Quantity Controls - Left under name/price */}
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.when, (item.quantity || 1) - 1)}
                          className="px-2 py-1 bg-gray-200 text-black hover:bg-gray-300 rounded text-xs font-medium transition"
                        >
                          −
                        </button>
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded text-black font-medium text-xs">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.when, (item.quantity || 1) + 1)}
                          className="px-2 py-1 bg-gray-200 text-black hover:bg-gray-300 rounded text-xs font-medium transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Right side: dropdown stacked above action buttons */}
                    <div className="flex flex-col items-end gap-3">
                      <select
                        value={item.type || ""}
                        onChange={(e) => handleUpdateType(item.when, e.target.value)}
                        className="border border-gray-300 px-2 py-1 rounded text-xs text-gray-700 bg-white min-w-[80px]"
                      >
                        <option value="">Type</option>
                        {product.types?.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-2">
                        <button
                          title="View"
                          onClick={() => { setDetailsEntry(item); setDetailsOpen(true); }}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded transition"
                        >
                          <PiEye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.when)}
                          title="Remove"
                          className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                        >
                          <PiTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>

        <div className="mt-6">
          <Summary
            totalProducts={cartCount}
            totalAmount={cartAmount}
            history={history}
            onDelete={handleDelete}
            onClear={handleClear}
            onPay={handlePay}
          />
        </div>
      </div>

      <ProductDetailsModal
        open={detailsOpen}
        onClose={() => { setDetailsOpen(false); setDetailsEntry(null); }}
        product={detailsEntry ? SAMPLE.find((p) => p.id === detailsEntry.id) || null : null}
        initialType={detailsEntry?.type}
        initialQuantity={detailsEntry?.quantity}
        onPay={async (productId, type, quantity) => {
          if (detailsEntry) {
            await handlePay(detailsEntry.when);
          } else {
            await handleInstantPay(productId, type, quantity);
          }
        }}
      />

      <MenuModal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        products={SAMPLE}
        categories={categoriesList}
        activeCategory={category}
        onAddToCart={handleAdd}
      />
    </div>
  );
}
