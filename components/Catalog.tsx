"use client";
import { useMemo, useState } from "react";
import { PiList, PiShoppingCart, PiTrash, PiArrowLeftBold, PiArrowRightBold } from "react-icons/pi";
import SearchBar from "./SearchBar";
import ProductRow from "../components/ProductRow";
import Summary from "../components/Summary";
import MenuModal from "../components/MenuModal";

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
  const [productTypes, setProductTypes] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const products = useMemo(() => {
    return SAMPLE.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const filteredByCategory = useMemo(() => {
    if (tableCategory === "All") {
      return products;
    }
    return products.filter((p) => p.category === tableCategory);
  }, [products, tableCategory]);

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
                onClick={() => { setTableCategory(c); setCurrentPage(1); }}
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
            className="p-2 md:p-3 transition flex-shrink-0 text-green-500"
            onClick={() => setMenuOpen(true)}
            title="Browse all products"
          >
            <PiList size={20}/>
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
                <th className="p-3 md:p-4 text-right text-black font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredByCategory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500 text-sm">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredByCategory.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((product) => {
                  const cartItem = getHistoryItem(product.id);
                  if (cartItem) {
                    return (
                      <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="p-3 md:p-4">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded overflow-hidden">
                            <img
                              src={product.img || "https://via.placeholder.com/200"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="font-semibold text-black text-sm">{product.name}</div>
                          <div className="text-xs text-gray-600">{product.priceMin} - {product.priceMax} XAF</div>
                        </td>
                        <td className="p-3 md:p-4">
                          <select
                            value={productTypes[product.id] || product.types?.[0] || ""}
                            onChange={(e) => setProductTypes((prev) => ({ ...prev, [product.id]: e.target.value }))}
                            className="border border-gray-300 px-2 py-1 rounded text-xs text-gray-700 bg-white w-full md:w-auto"
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
                            <div className="flex items-center gap-2">
                              <label htmlFor={`cart-qty-${product.id}`} className="text-sm text-gray-700 font-medium">Qty</label>
                              <input
                                id={`cart-qty-${product.id}`}
                                type="number"
                                min={1}
                                value={cartItem.quantity || 1}
                                onChange={(e) => handleUpdateQuantity(product.id, Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-14 h-5 text-center border border-gray-300 text-black font-medium px-2"
                                aria-label={`Quantity for ${product.name}`}
                                title="Quantity"
                              />
                            </div>
                            <button
                              onClick={() => handleDeleteFromCart(product.id)}
                              title="Remove"
                              className="p-2 text-red-500 hover:bg-red-50 rounded transition"
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
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Desktop Pagination */}
        <div className="hidden md:flex mt-4 px-4 mb-6 items-center justify-between text-sm">
          <div className="text-gray-600">Showing {filteredByCategory.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredByCategory.length)} of {filteredByCategory.length}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center gap-1 px-2 py-1 bg-gray-100 border text-gray-700 rounded disabled:opacity-50"><PiArrowLeftBold size={14} /></button>
            <div className="text-gray-700 text-xs">{currentPage} / {Math.max(1, Math.ceil(filteredByCategory.length / pageSize))}</div>
            <button onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil(filteredByCategory.length / pageSize)), p + 1))} disabled={currentPage === Math.max(1, Math.ceil(filteredByCategory.length / pageSize))} className="flex items-center gap-1 px-2 py-1 bg-gray-100 border text-gray-700 rounded disabled:opacity-50"><PiArrowRightBold size={14} /></button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filteredByCategory.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm bg-white rounded">
              No products found.
            </div>
          ) : (
            filteredByCategory.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((product) => {
              const cartItem = getHistoryItem(product.id);
              return (
                <div key={product.id} className="bg-white  p-3 shadow-sm border border-gray-200">
                  <div className="flex gap-3 items-start">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden">
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
                      <div className="text-xs text-gray-600">{product.priceMin} - {product.priceMax} XAF</div>
                      {cartItem && (
                        <div className="mt-2 flex items-center gap-2">
                          <label htmlFor={`cart-qty-mobile-${product.id}`} className="text-sm text-gray-700 font-medium">Qty</label>
                          <input
                            id={`cart-qty-mobile-${product.id}`}
                            type="number"
                            min={1}
                            value={cartItem.quantity || 1}
                            onChange={(e) => handleUpdateQuantity(product.id, Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-14 h-5 text-center border border-gray-300 text-black font-medium px-2"
                            aria-label={`Quantity for ${product.name}`}
                            title="Quantity"
                          />
                        </div>
                      )}
                    </div>

                    {/* Right side: dropdown and action button */}
                    <div className="flex flex-col items-end gap-2">
                      <select
                        value={productTypes[product.id] || product.types?.[0] || ""}
                        onChange={(e) => setProductTypes((prev) => ({ ...prev, [product.id]: e.target.value }))}
                        className="border border-gray-300 px-2 py-1 rounded text-xs text-gray-700 bg-white min-w-[80px]"
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
                          className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                        >
                          <PiTrash size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAdd(product, productTypes[product.id])}
                          title="Add to Cart"
                          className="p-2 text-green-500 hover:bg-green-50 rounded transition"
                        >
                          <PiShoppingCart size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Mobile Pagination */}
        <div className="md:hidden flex mt-4 px-2 mb-6 flex-col sm:flex-row items-center gap-2 justify-between text-xs">
          <div className="text-gray-600">Showing {filteredByCategory.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredByCategory.length)} of {filteredByCategory.length}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center gap-1 px-2 py-1 bg-gray-100 border text-gray-700 rounded disabled:opacity-50"><PiArrowLeftBold size={14} /></button>
            <div className="text-gray-700 text-xs">{currentPage} / {Math.max(1, Math.ceil(filteredByCategory.length / pageSize))}</div>
            <button onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil(filteredByCategory.length / pageSize)), p + 1))} disabled={currentPage === Math.max(1, Math.ceil(filteredByCategory.length / pageSize))} className="flex items-center gap-1 px-2 py-1 bg-gray-100 border text-gray-700 rounded disabled:opacity-50"><PiArrowRightBold size={14} /></button>
          </div>
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
