"use client";
import React from "react";
import { PiMagnifyingGlass, PiGear } from "react-icons/pi";

export default function SearchBar({
  value,
  onChange,
  onSettings,
}: {
  value: string;
  onChange: (v: string) => void;
  onSettings: () => void;
}) {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="flex-1 flex items-center bg-white border border-gray-200  shadow-sm hover:shadow-md transition px-3 md:px-4 py-2 md:py-3">
        <PiMagnifyingGlass size={18} className="text-green-600 mr-2 md:mr-3 flex-shrink-0" />
        <input
          className="flex-1 outline-none text-xs md:text-sm text-black placeholder-gray-400 bg-transparent"
          placeholder="Search products..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <button
        onClick={onSettings}
        aria-label="Settings"
        className="p-2 md:p-3 transition text-green-500 flex-shrink-0"
        title="Settings"
      >
        <PiGear size={18} className="md:hidden" />
        <PiGear size={20} className="hidden md:inline" />
      </button>
    </div>
  );
}
