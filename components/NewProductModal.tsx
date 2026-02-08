"use client";

import React, { useState, useEffect } from "react";
import { PiX } from "react-icons/pi";

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

type ProductInput = {
  name: string;
  priceMin: number;
  priceMax: number;
  img?: string;
  types: string[];
  category?: string;
  description?: string;
};

export default function NewProductModal({
  open,
  onClose,
  onCreate,
  initialProduct,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (p: ProductInput) => void;
  initialProduct?: Omit<Product, 'id'> & { id?: string };
}) {
  const [name, setName] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [img, setImg] = useState("");
  const [imgDataUrl, setImgDataUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [types, setTypes] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      // If editing, pre-populate form with product data
      if (initialProduct) {
        setName(initialProduct.name || "");
        setPriceMin(initialProduct.priceMin || 0);
        setPriceMax(initialProduct.priceMax || 0);
        setImg(initialProduct.img || "");
        setImgDataUrl(initialProduct.img || "");
        setTypes((initialProduct.types || []).join(", "));
        setCategory(initialProduct.category || "");
        setDescription(initialProduct.description || "");
      } else {
        // Otherwise, clear form for new product
        setName("");
        setPriceMin(0);
        setPriceMax(0);
        setImg("");
        setImgDataUrl("");
        setTypes("");
        setCategory("");
        setDescription("");
      }
    } else {
      // Clear form when modal closes
      setName("");
      setPriceMin(0);
      setPriceMax(0);
      setImg("");
      setImgDataUrl("");
      setTypes("");
      setCategory("");
      setDescription("");
    }
  }, [open, initialProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!priceMin || Number(priceMin) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }
    const typesArr = types.split(",").map((t) => t.trim()).filter(Boolean);
    if (typesArr.length === 0) {
      setError("Provide at least one type (comma separated).");
      return;
    }

    const payload: ProductInput = {
      name: name.trim() || "Untitled",
      priceMin: Number(priceMin) || 0,
      priceMax: Number(priceMax) || Number(priceMin) || 0,
      img: imgDataUrl || img || "",
      types: typesArr,
      category: category.trim() || "",
      description: description.trim() || "",
    };

    onCreate(payload);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-60 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} aria-hidden={!open}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <aside className={`fixed right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-xl transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h3 className="text-lg font-semibold text-black">{initialProduct ? "Edit Product" : "Create Product"}</h3>
          <button onClick={onClose} className="p-2  hover:bg-gray-100 text-black"><PiX size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-auto h-full">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 px-3 py-2" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Price (current)</label>
              <input type="number" value={priceMin} onChange={(e) => setPriceMin(Number(e.target.value))} className="w-full border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Old Price (optional)</label>
              <input type="number" value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full border border-gray-300 px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Types (comma separated)</label>
            <input value={types} onChange={(e) => setTypes(e.target.value)} className="w-full border border-gray-300 px-3 py-2" placeholder="Small, Large" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Image (upload from device)</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setError(null);
                setProcessing(true);
                try {
                  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
                  if (!allowed.includes(file.type)) {
                    setError("Unsupported image format. Use JPEG, PNG, WEBP or GIF.");
                    setProcessing(false);
                    return;
                  }

                  const compressed = await (async function compressImage(f: File) {
                    const maxWidth = 1200;
                    const targetSize = 500 * 1024; // aim for ~500KB
                    const reader2 = new FileReader();
                    const dataUrl: string = await new Promise((res, rej) => {
                      reader2.onerror = rej;
                      reader2.onload = () => res(reader2.result as string);
                      reader2.readAsDataURL(f);
                    });

                    const imgEl = document.createElement("img");
                    imgEl.src = dataUrl;
                    await new Promise((res, rej) => {
                      imgEl.onload = res;
                      imgEl.onerror = rej;
                    });

                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return dataUrl;

                    const ratio = Math.min(1, maxWidth / imgEl.width);
                    canvas.width = Math.round(imgEl.width * ratio);
                    canvas.height = Math.round(imgEl.height * ratio);
                    ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);

                    // try progressively reducing quality to hit target size
                    let quality = 0.9;
                    let out: string = canvas.toDataURL("image/jpeg", quality);
                    function dataUrlSize(u: string) {
                      const base64 = u.split(",")[1] || "";
                      return Math.round((base64.length * 3) / 4);
                    }

                    while (dataUrlSize(out) > targetSize && quality > 0.4) {
                      quality -= 0.1;
                      out = canvas.toDataURL("image/jpeg", quality);
                    }

                    return out;
                  })(file);

                  setImgDataUrl(compressed);
                  setImg("");
                } catch (err) {
                  setError("Failed to process image.");
                } finally {
                  setProcessing(false);
                }
              }}
              className="w-full"
            />

            {imgDataUrl && (
              <div className="mt-2 w-40 h-24 bg-gray-100  overflow-hidden">
                <img src={imgDataUrl} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full border border-gray-300 px-3 py-2" />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={processing || !name.trim() || !priceMin || types.split(",").map((t) => t.trim()).filter(Boolean).length === 0}
              className={`bg-[var(--instanvi-primary)] hover:bg-[var(--instanvi-primary-600)] text-white px-4 py-2  disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {processing ? "Processing..." : initialProduct ? "Update Product" : "Create Product"}
            </button>
            <button type="button" onClick={onClose} className="border px-4 py-2 ">Cancel</button>
          </div>
        </form>
      </aside>
    </div>
  );
}
