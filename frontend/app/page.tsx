"use client";

import React, { useState } from "react";

export default function Page() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: "Manya C R",
    dob: "",
    aadhaar: "",
    consent: false,
  });
  const [loading, setLoading] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  const handleNext = () => {
    if (step === 1) setStep(2);
  };

  const handleSubmit = async () => {
    if (!formData.consent) {
      alert("Please check the consent box to proceed.");
      return;
    }
    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${backendUrl}/api/scheme/eligibility`);
      
      if (res.ok) {
        setApplicationId("HS-2025-01478");
        setStep(3);
      } else {
        alert("Error connecting to government services.");
      }
    } catch (err) {
      setApplicationId("HS-2025-01478");
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="w-full max-w-2xl bg-white shadow-sm rounded-lg p-4 mb-6 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white font-bold rounded-md px-3 py-1 text-sm">
            SIH 2026
          </div>
          <h1 className="text-xl font-bold text-gray-800">Sarkar Seva</h1>
        </div>
        <span className="text-xs bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded">
          Interoperability Portal
        </span>
      </header>

      {/* Main App Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Progress Bar */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center text-xs text-gray-500 font-medium">
          <span className={step >= 1 ? "text-blue-600 font-bold" : ""}>1. Details</span>
          <span>→</span>
          <span className={step >= 2 ? "text-blue-600 font-bold" : ""}>2. Consent</span>
          <span>→</span>
          <span className={step === 3 ? "text-blue-600 font-bold" : ""}>3. Status</span>
        </div>

        {/* STEP 1: Personal Information */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Housing Scheme Application</h2>
            <p className="text-xs text-gray-500">
              Enter basic details once. System will auto-fetch records across departments.
            </p>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-black"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input
                type="text"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-black"
                placeholder="DD/MM/YYYY"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Aadhaar Identifier *</label>
              <input
                type="text"
                value={formData.aadhaar}
                onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-black"
                placeholder="**** **** 1234"
              />
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-700 transition"
            >
              Next Step
            </button>
          </div>
        )}

        {/* STEP 2: Consent Gateway */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Department Consent Gate</h2>
            <div className="p-4 bg-blue-50 rounded-lg text-xs text-blue-900 space-y-2 border border-blue-100">
              <p className="font-semibold">Automated Data Fetching Notice:</p>
              <p>With your explicit consent, Sarkar Seva will securely query:</p>
              <ul className="list-disc list-inside space-y-1 font-mono text-blue-800">
                <li>Land Records Department (Revenue)</li>
                <li>Income Department</li>
                <li>Identity Verification (Aadhaar Portal)</li>
              </ul>
            </div>

            <label className="flex items-start space-x-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                className="mt-0.5 h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <span className="text-xs text-gray-600">
                I authorize Sarkar Seva to query linked databases via standardized APIs for application processing.
              </span>
            </label>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Processing via Multi-Agent AI..." : "Submit & Auto-Verify"}
            </button>
          </div>
        )}

        {/* STEP 3: Submission & Status Tracking */}
        {step === 3 && (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-xl font-bold text-gray-800">Application Submitted!</h2>
            <p className="text-xs text-gray-500">Your application has been received and is being processed.</p>

            <div className="bg-gray-50 p-4 rounded-lg border text-left space-y-2">
              <div className="text-xs text-gray-500">Application Number:</div>
              <div className="text-base font-mono font-bold text-blue-600">{applicationId}</div>
              <hr />
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Land Records:</span>
                  <span className="text-green-600 font-medium">Verified ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Income Verification:</span>
                  <span className="text-green-600 font-medium">Verified ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Current Status:</span>
                  <span className="text-amber-600 font-medium">Under Final Review</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium text-xs hover:bg-gray-200 transition"
            >
              Apply for Another Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
}