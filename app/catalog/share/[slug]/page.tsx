"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SharePage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params && (params as any).slug) || null;

  const [catalog, setCatalog] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "view">("email");
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [inputOtp, setInputOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("instanvi_catalogs");
      if (raw) {
        const parsed = JSON.parse(raw);
        const found = Array.isArray(parsed) ? parsed.find((c: any) => c.slug === slug) : null;
        if (found) setCatalog(found);
      }
    } catch (e) {
      // ignore
    }

    try {
      const rawP = localStorage.getItem("instanvi_products");
      if (rawP) setProducts(JSON.parse(rawP));
    } catch (e) {}
  }, [slug]);

  const sendOtp = () => {
    if (!email || !slug) return setMessage("Enter a valid email");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `instanvi_otp_${slug}_${email}`;
    const payload = { code, expires: Date.now() + 5 * 60 * 1000 }; // 5 minutes
    try {
      localStorage.setItem(key, JSON.stringify(payload));
    } catch (e) {}
    setDemoOtp(code); // show OTP in UI for demo purposes
    setInputOtp("");
    setStep("otp");
    setMessage("OTP sent (demo shown below). It expires in 5 minutes.");
  };

  const verify = () => {
    if (!email || !slug) return setMessage("Invalid state");
    const key = `instanvi_otp_${slug}_${email}`;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return setMessage("No OTP found. Please request a new code.");
      const parsed = JSON.parse(raw);
      if (parsed.expires < Date.now()) return setMessage("OTP expired. Request a new one.");
      if (parsed.code !== inputOtp.trim()) return setMessage("Incorrect OTP");
      // verified - store verification and redirect to catalog
      localStorage.setItem(`instanvi_share_verified_${slug}_${email}`, JSON.stringify({ email, when: Date.now() }));
      if (catalog) {
        // Store the catalog context so the catalog page can pre-select it
        localStorage.setItem("instanvi_customer_catalog_access", JSON.stringify({ 
          catalogId: catalog.id, 
          catalogName: catalog.name,
          category: catalog.category,
          email 
        }));
      }
      // Redirect to catalog page
      router.push("/catalog");
    } catch (e) {
      setMessage("Verification failed");
    }
  };

  if (!slug) return <div className="bg-white flex text-center justify-center min-h-screen mt-300 text-red-500">Invalid link</div>;
  if (!catalog) return <div className="bg-white flex text-center justify-center min-h-screen mt-300 p-6 text-red-500">Catalog not found for this link.</div>;

  if (step === "email") {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-6 shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-black">Access Catalog</h2>
            <p className="text-sm text-gray-600 mt-1">{catalog.name}</p>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-200"
            />

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={sendOtp}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium"
              >
                Send Code
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-4 py-3 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>
            </div>

            {message && <div className="mt-2 text-sm text-red-600">{message}</div>}
          </div>
        </div>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-6 shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-black">Verify Email</h2>
            <p className="text-sm text-gray-600 mt-1">Enter the 6-digit code sent to <span className="font-medium">{email}</span></p>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700">One-time code</label>
            <input
              value={inputOtp}
              onChange={(e) => setInputOtp(e.target.value)}
              placeholder="123456"
              className="w-full border px-4 py-3 text-center tracking-widest text-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-200"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={verify}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium"
              >
                Verify & Continue
              </button>
              <button
                onClick={() => { setStep("email"); setMessage(null); }}
                className="px-4 py-3 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
              >
                Change Email
              </button>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => { sendOtp(); setMessage("OTP resent"); }}
                className="text-sm text-green-600 hover:underline"
              >
                Resend code
              </button>
              {demoOtp ? (
                <div className="text-sm text-gray-500">Demo OTP: <strong className="text-black">{demoOtp}</strong></div>
              ) : null}
            </div>

            {message && <div className="mt-2 text-sm text-red-600">{message}</div>}
          </div>
        </div>
      </div>
    );
  }

  // view
  const ids = Object.keys(catalog.prices || {});
  const list = ids
    .map((id) => products.find((p: any) => p.id === id))
    .filter(Boolean)
    .map((p: any) => ({ ...p, priceMin: catalog.prices[p.id]?.priceMin ?? p.priceMin, priceMax: catalog.prices[p.id]?.priceMax ?? p.priceMax }));

  return (
    <div className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded shadow text-center">
        <h2 className="text-lg font-semibold mb-2">Redirecting...</h2>
        <p className="text-sm text-gray-600">Taking you to the catalog page to add products and make a purchase.</p>
      </div>
    </div>
  );
}
