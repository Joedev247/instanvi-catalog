"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PiArrowRight } from "react-icons/pi";

type Organization = {
  id: string;
  name: string;
  ownerEmail: string;
  industry: string;
  createdAt: string;
};

export default function SetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !ownerEmail.trim() || !industry.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const org: Organization = {
        id: `org_${Date.now()}`,
        name: name.trim(),
        ownerEmail: ownerEmail.trim(),
        industry: industry.trim(),
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("instanvi_organization", JSON.stringify(org));
      router.push("/catalog/product-menu");
    } catch (e) {
      alert("Failed to create organization");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-green-50 shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl text-center font-bold text-black mb-2">Create Organization</h1>
        <p className="text-gray-600 text-center mb-6">Set up your organization to get started</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Restaurant"
              className="w-full border border-gray-300 px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
            <input
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-gray-300 px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 text-black focus:outline-none focus:border-green-500"
            >
              <option value="">Select an industry</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Cafe">Cafe</option>
              <option value="Retail">Retail</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 transition disabled:opacity-50"
          >
            Next <PiArrowRight size={20} />
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Your organization data is stored locally in your browser
        </p>
      </div>
    </div>
  );
}
