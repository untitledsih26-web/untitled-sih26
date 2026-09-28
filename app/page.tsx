"use client";

import React, { useState } from "react";

export default function AppRouter() {
  // This state controls which page we are looking at without needing Next.js folders
  const [currentView, setCurrentView] = useState("landing");
  
  // Form State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", dob: "", aadhaar: "", consent: false });
  const [loading, setLoading] = useState(false);

  // --- VIEW 1: LANDING PAGE ---
  if (currentView === "landing") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 mb-4">
            <span className="bg-blue-600 text-white font-bold rounded px-2 py-0.5 text-xs">SIH 2026</span>
            <span className="text-sm font-semibold text-gray-700">Sarkar Seva</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Unified Interoperability</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Select your portal role to continue to the dashboard.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Citizen Card */}
          <button onClick={() => setCurrentView("user")} className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition text-left">
            <div className="bg-blue-50 p-3 w-12 h-12 flex items-center justify-center rounded-lg text-blue-600 mb-4 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition">👤</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Citizen Portal</h2>
            <p className="text-sm text-gray-500">Apply for schemes, track status, and manage your digital consent.</p>
          </button>

          {/* Admin Card */}
          <button onClick={() => setCurrentView("admin")} className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-emerald-500 hover:shadow-md transition text-left">
            <div className="bg-emerald-50 w-12 h-12 flex items-center justify-center p-3 rounded-lg text-emerald-600 mb-4 font-bold text-xl group-hover:bg-emerald-600 group-hover:text-white transition">🛡️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Department Admin</h2>
            <p className="text-sm text-gray-500">Review AI-flagged applications and monitor cross-department APIs.</p>
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW 2: CITIZEN FORM (Matches your Screenshots) ---
  if (currentView === "user") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8 font-sans text-black">
        <header className="w-full max-w-2xl bg-white shadow-sm rounded-lg p-4 mb-6 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white font-bold rounded-md px-3 py-1 text-sm">SIH 2026</div>
            <h1 className="text-xl font-bold text-gray-800">Sarkar Seva</h1>
          </div>
          <button onClick={() => setCurrentView("landing")} className="text-xs bg-gray-100 text-gray-600 font-medium px-3 py-1 rounded hover:bg-gray-200">← Back Home</button>
        </header>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-white px-6 py-4 border-b flex justify-between items-center text-xs text-gray-500 font-medium">
            <span className={step >= 1 ? "text-blue-600 font-bold" : ""}>1. Details</span>
            <span>→</span>
            <span className={step >= 2 ? "text-blue-600 font-bold" : ""}>2. Consent</span>
            <span>→</span>
            <span className={step === 3 ? "text-blue-600 font-bold" : ""}>3. Status</span>
          </div>

          {step === 1 && (
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Housing Scheme Application</h2>
              <p className="text-xs text-gray-500">Enter basic details once. System will auto-fetch records across departments.</p>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input type="text" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="w-full p-2.5 border border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Aadhaar Identifier *</label>
                <input type="text" value={formData.aadhaar} onChange={(e) => setFormData({...formData, aadhaar: e.target.value})} className="w-full p-2.5 border border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-700 transition">Next Step</button>
            </div>
          )}

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
                <input type="checkbox" checked={formData.consent} onChange={(e) => setFormData({...formData, consent: e.target.checked})} className="mt-0.5 h-4 w-4 text-blue-600 rounded" />
                <span className="text-xs text-gray-600">I authorize Sarkar Seva to query linked databases via standardized APIs for application processing.</span>
              </label>
              <button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setStep(3); }, 1500); }} disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50">
                {loading ? "Processing via AI Agents..." : "Submit & Auto-Verify"}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
              <h2 className="text-xl font-bold text-gray-800">Application Submitted!</h2>
              <p className="text-xs text-gray-500">Your application has been received and is being processed.</p>
              <div className="bg-white p-4 rounded-lg border border-gray-800 text-left space-y-2">
                <div className="text-xs text-gray-500">Application Number:</div>
                <div className="text-base font-mono font-bold text-blue-600">HS-2025-01478</div>
                <hr className="border-gray-200" />
                <div className="text-xs space-y-1">
                  <div className="flex justify-between"><span className="text-gray-500">Land Records:</span><span className="text-green-600 font-medium">Verified ✓</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Income Verification:</span><span className="text-green-600 font-medium">Verified ✓</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Current Status:</span><span className="text-amber-600 font-medium">Under Final Review</span></div>
                </div>
              </div>
              <button onClick={() => setStep(1)} className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium text-xs hover:bg-gray-200 transition">Apply for Another Service</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- VIEW 3: ADMIN DASHBOARD ---
  if (currentView === "admin") {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-black">
        <header className="mb-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Department Dashboard</h1>
            <p className="text-sm text-gray-500">AI Validation & Interoperability Oversight</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200">🟢 LangGraph Agents: Online</span>
            <button onClick={() => setCurrentView("landing")} className="text-sm bg-gray-100 text-gray-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-200">Log Out</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-semibold text-gray-800">Recent Interoperability Requests</h2></div>
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500">
                <tr><th className="px-6 py-3">App ID</th><th className="px-6 py-3">Applicant Name</th><th className="px-6 py-3">Service</th><th className="px-6 py-3">AI Status</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-medium text-gray-900">HS-2025-01478</td><td className="px-6 py-4">Manya C R</td><td className="px-6 py-4">Housing Scheme</td>
                  <td className="px-6 py-4"><span className="text-green-600 font-medium">✓ Data Cleared</span></td>
                </tr>
                <tr className="bg-red-50/30">
                  <td className="px-6 py-4 font-mono font-medium text-gray-900">IC-2025-99212</td><td className="px-6 py-4">Ramesh Kumar</td><td className="px-6 py-4">Income Certificate</td>
                  <td className="px-6 py-4"><span className="text-red-600 font-medium">⚠️ Anomaly Detected</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-4 border-b pb-2">AI Validation Agent Flag</h2>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-gray-700 space-y-3">
              <p><strong className="text-gray-900">Issue: IC-2025-99212</strong></p>
              <p>The system detected a name mismatch during cross-department API validation.</p>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between bg-white p-2 rounded border border-red-100">
                  <span className="text-xs text-gray-500">Revenue Dept Database:</span><span className="text-xs font-medium text-red-600">Ramesh K.</span>
                </div>
                <div className="flex justify-between bg-white p-2 rounded border border-gray-200">
                  <span className="text-xs text-gray-500">Identity Portal Database:</span><span className="text-xs font-medium">Ramesh Kumar</span>
                </div>
              </div>
              <div className="pt-4 flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-md font-medium text-xs hover:bg-blue-700">Approve Exception</button>
                <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-md font-medium text-xs hover:bg-gray-50">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}