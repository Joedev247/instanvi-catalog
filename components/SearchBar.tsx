"use client";
import React from "react";
import { PiMagnifyingGlass, PiGear } from "react-icons/pi";

export default function SearchBar({
  value,
  onChange,
  onSettings,
  onDuplicate,
  onProductMenu,
  categories,
  selectedCategory,
  onCategoryChange,
}: {
  value: string;
  onChange: (v: string) => void;
  onSettings: () => void;
  onDuplicate?: () => void;
  onProductMenu?: () => void;
  categories?: string[];
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
}) {
  return (
    <div className="flex items-center gap-2 md:gap-3 w-full">
     

<div className="flex-1 flex items-center bg-white border border-gray-200  shadow-sm hover:shadow-md transition px-3 md:px-4 py-2 ">
        <PiMagnifyingGlass size={18} className="text-green-600 mr-2 md:mr-3 flex-shrink-0" />
        <input
          className="flex-1 outline-none text-xs md:text-sm text-black placeholder-gray-400 bg-transparent"
          placeholder="Search products..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

       {categories && (
        <select
          value={selectedCategory ?? ""}
          onChange={(e) => onCategoryChange?.(e.target.value === "" ? null : e.target.value)}
          className="px-3 md:px-4 py-2 border border-gray-200 bg-white text-black text-xs md:text-sm shadow-sm hover:shadow-md transition"
          title="Select catalog type to view specific customer category products"
        >
          <option value="" disabled>Catalog Type</option>
          <option value="Default">Default</option>
          {categories.filter((cat) => cat !== "Other").map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={onProductMenu}
          aria-label="Product Menu"
          className="px-3 md:px-4 md:py-2 transition border border-gray-200 hover:bg-green-100 text-black text-sm "
          title="Product Menu"
        >
          Product Menu
        </button>

        <button
          onClick={onDuplicate}
          aria-label="Duplicate"
          className="px-3  md:px-4 md:py-2 transition bg-green-500 hover:bg-green-600 text-white text-sm "
          title="Duplicate"
        >
          Duplicate
        </button>

        <button
          onClick={onSettings}
          aria-label="Settings"
          className="transition text-green-500 hover:opacity-80 flex-shrink-0"
          title="Settings"
        >
          <PiGear size={30} className="md:hidden" />
          <PiGear size={30} className="hidden md:inline" />
        </button>
      </div>
    </div>
  );
}
