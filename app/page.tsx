"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Home, LayoutDashboard, FileText, MessageSquare, LogOut, 
  CheckCircle2, Shield, Loader2, Activity, Send
} from "lucide-react";

// Supabase Init
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ciwhmfbpydwqfjmphzfc.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_CWdbGlLgthJSW";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SarkarSevaApp() {
  const [session, setSession] = useState<any>(null);
  const [currentView, setCurrentView] = useState("landing");
  
  // Auth State
  const [authMode, setAuthMode] = useState<"email" | "phone">("email");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Service Workflow State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", dob: "", scheme: "Housing Scheme Eligibility", consent: false });
  const [pipelineActive, setPipelineActive] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState(0);

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([{ role: "agent", text: "Hello! How can I assist you with Sarkar Seva today?" }]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { error } = authMode === "email" 
        ? await supabase.auth.signInWithOtp({ email: contact })
        : await supabase.auth.signInWithOtp({ phone: contact });
      if (error) throw error;
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        [authMode === "email" ? "email" : "phone"]: contact,
        token: otp,
        type: authMode === "email" ? "email" : "sms"
      } as any);
      if (error) throw error;
      setSession(data.session);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runPipeline = () => {
    setPipelineActive(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setPipelineProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => { setPipelineActive(false); setStep(4); }, 1000);
      }
    }, 1000);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-slate-100 font-sans">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Sarkar Seva Portal</h1>
            <p className="text-xs text-slate-400">SIH 2026 GovTech Authentication</p>
          </div>
          
          <div className="flex bg-slate-900 p-1 rounded-xl text-xs font-medium">
            <button onClick={() => { setAuthMode("email"); setOtpSent(false); }} className={`flex-1 py-2 rounded-lg ${authMode === "email" ? "bg-blue-600 text-white" : "text-slate-400"}`}>Email OTP</button>
            <button onClick={() => { setAuthMode("phone"); setOtpSent(false); }} className={`flex-1 py-2 rounded-lg ${authMode === "phone" ? "bg-blue-600 text-white" : "text-slate-400"}`}>Mobile OTP</button>
          </div>

          {error && <div className="p-3 bg-red-950/50 text-red-300 text-xs rounded-lg border border-red-800">{error}</div>}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <input type={authMode === "email" ? "email" : "tel"} required placeholder={authMode === "email" ? "Email Address" : "+91..."} value={contact} onChange={e => setContact(e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm outline-none text-white focus:border-blue-500 transition-colors" />
              <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-sm font-medium flex justify-center text-white transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Send Secure OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-xs text-slate-400 text-center">Code sent to {contact}</div>
              <input type="text" maxLength={6} required placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-center text-lg tracking-widest font-mono text-white outline-none focus:border-emerald-500 transition-colors" />
              <button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl text-sm font-medium flex justify-center text-white transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Verify & Enter"}
              </button>
              <button type="button" onClick={() => setOtpSent(false)} className="w-full text-xs text-slate-400 hover:text-white pt-2">← Change contact info</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Shield className="w-5 h-5 text-blue-500"/> Sarkar Seva</h2>
          <p className="text-xs text-slate-500 mt-1">SIH 2026 Edition</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm">
          <button onClick={() => setCurrentView("landing")} className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${currentView === "landing" ? "bg-blue-600/20 text-blue-400" : "hover:bg-slate-800"}`}><Home className="w-4 h-4"/> Overview</button>
          <button onClick={() => setCurrentView("workflow")} className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${currentView === "workflow" ? "bg-blue-600/20 text-blue-400" : "hover:bg-slate-800"}`}><FileText className="w-4 h-4"/> Services & Workflows</button>
          <button onClick={() => setCurrentView("admin")} className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${currentView === "admin" ? "bg-emerald-600/20 text-emerald-400" : "hover:bg-slate-800"}`}><LayoutDashboard className="w-4 h-4"/> Admin Dashboard</button>
          <button onClick={() => setCurrentView("chat")} className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${currentView === "chat" ? "bg-blue-600/20 text-blue-400" : "hover:bg-slate-800"}`}><MessageSquare className="w-4 h-4"/> AI Support Chat</button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center gap-3 p-3 text-sm text-slate-400 hover:text-white transition"><LogOut className="w-4 h-4"/> Sign Out</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> LangGraph Agents Online
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-500 font-medium">{session.user.email || session.user.phone}</div>
            <button onClick={() => supabase.auth.signOut()} className="md:hidden text-xs bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 text-slate-700">Logout</button>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {/* VIEW: LANDING */}
          {currentView === "landing" && (
            <div className="max-w-4xl mx-auto space-y-6 text-center pt-8">
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900">Welcome to Sarkar Seva</h1>
              <p className="text-slate-500 max-w-lg mx-auto">Secure, Interoperable, Multi-Agent Government Services built for the citizens of the future.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <div onClick={() => setCurrentView("workflow")} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 cursor-pointer transition group">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform"/>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">Apply for Services</h3>
                  <p className="text-xs text-slate-500">Access scheme eligibility and automated workflows.</p>
                </div>
                <div onClick={() => setCurrentView("admin")} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-500 cursor-pointer transition group">
                  <LayoutDashboard className="w-12 h-12 text-emerald-600 mx-auto mb-4 group-hover:scale-110 transition-transform"/>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">Department Oversight</h3>
                  <p className="text-xs text-slate-500">Monitor multi-agent transactions and data flows.</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: 5-STEP WORKFLOW */}
          {currentView === "workflow" && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex text-xs font-semibold bg-slate-50 border-b border-slate-100 overflow-x-auto">
                {["Request", "Consent", "Agents", "Data Sync", "Result"].map((lbl, i) => (
                  <div key={lbl} className={`flex-1 min-w-[100px] p-3 md:p-4 text-center ${step >= i + 1 ? "text-blue-600 bg-blue-50/50 border-b-2 border-blue-600" : "text-slate-400"}`}>
                    <span className="hidden md:inline">{i+1}. </span>{lbl}
                  </div>
                ))}
              </div>
              
              <div className="p-6 md:p-10">
                {step === 1 && (
                  <div className="space-y-5 animate-in fade-in zoom-in duration-300">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Request Review & Details</h2>
                      <p className="text-xs text-slate-500 mt-1">Select your required service and verify your credentials.</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Target Service</label>
                        <select className="w-full p-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={formData.scheme} onChange={e => setFormData({...formData, scheme: e.target.value})}>
                          <option>Housing Scheme Eligibility</option>
                          <option>Income Certificate Issuance</option>
                          <option>Ration Subsidy Request</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Full Legal Name</label>
                        <input type="text" placeholder="E.g. Ramesh Kumar" className="w-full p-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}/>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Secure Identifier</label>
                        <input type="text" disabled value="[Aadhaar Redacted]" className="w-full p-3 border border-slate-300 bg-slate-100 text-slate-500 rounded-xl text-sm font-mono cursor-not-allowed"/>
                      </div>
                      <button onClick={() => setStep(2)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-medium transition-colors mt-2">Proceed to Consent</button>
                    </div>
                  </div>
                )}
                
                {step === 2 && (
                  <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Consent & Authorization Gate</h2>
                      <p className="text-xs text-slate-500 mt-1">Review data fetching requirements before executing the AI pipeline.</p>
                    </div>
                    <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 text-sm text-amber-900 leading-relaxed">
                      <strong>Mandatory Interoperability Notice:</strong><br/> 
                      To process this request, Sarkar Seva must execute cross-departmental queries via standardized APIs. Records fetched will include Land Registry, Revenue Dept databases, and Secure Identity Verification.
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
                      <input type="checkbox" checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"/>
                      <span className="text-sm text-slate-700">I provide explicit digital consent to authorize automated cross-department data fetching for this specific transaction.</span>
                    </label>
                    <div className="flex gap-3 pt-4">
                      <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl text-sm font-medium transition-colors">Back</button>
                      <button disabled={!formData.consent} onClick={() => { setStep(3); runPipeline(); }} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors">Authorize & Orchestrate</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8 text-center animate-in fade-in duration-500 py-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Multi-Agent Orchestration</h2>
                      <p className="text-xs text-slate-500 mt-1">LangGraph pipeline is securely processing your request...</p>
                    </div>
                    
                    <div className="relative">
                      <Activity className="w-16 h-16 text-blue-600 mx-auto animate-pulse"/>
                      {pipelineProgress >= 100 && <CheckCircle2 className="w-6 h-6 text-emerald-500 absolute top-0 right-1/2 translate-x-10 -translate-y-2 bg-white rounded-full"/>}
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                      <div className="bg-blue-600 h-full transition-all duration-500 ease-out" style={{width: `${pipelineProgress}%`}}></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono text-left bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <div className={`p-2 rounded ${pipelineProgress > 10 ? "bg-blue-100/50 text-blue-700 font-medium" : "text-slate-400"}`}>1. Request Agent (Intent Match)</div>
                      <div className={`p-2 rounded ${pipelineProgress > 30 ? "bg-blue-100/50 text-blue-700 font-medium" : "text-slate-400"}`}>2. Routing Agent (API Mapping)</div>
                      <div className={`p-2 rounded ${pipelineProgress > 50 ? "bg-blue-100/50 text-blue-700 font-medium" : "text-slate-400"}`}>3. Data Agents (Cross-Query)</div>
                      <div className={`p-2 rounded ${pipelineProgress > 70 ? "bg-blue-100/50 text-blue-700 font-medium" : "text-slate-400"}`}>4. Validation (Anomaly Check)</div>
                      <div className={`p-2 rounded ${pipelineProgress > 85 ? "bg-blue-100/50 text-blue-700 font-medium" : "text-slate-400"}`}>5. Consent & Security Gate</div>
                      <div className={`p-2 rounded ${pipelineProgress > 95 ? "bg-blue-100/50 text-blue-700 font-medium" : "text-slate-400"}`}>6. Response (Payload Ready)</div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-300">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Data Exchange Ledger</h2>
                      <p className="text-xs text-slate-500 mt-1">Review the standardized JSON response securely fetched via APIs.</p>
                    </div>
                    <pre className="bg-slate-900 text-emerald-400 p-5 rounded-xl text-xs overflow-x-auto border border-slate-800 shadow-inner">
{`{
  "transaction_id": "TXN-9912-OP",
  "timestamp": "${new Date().toISOString()}",
  "services": {
    "identity_portal": { 
      "status": 200, 
      "name_match": true,
      "uid_status": "VALIDATED"
    },
    "revenue_dept": { 
      "status": 200, 
      "income_threshold_met": true,
      "land_record_clear": true
    }
  },
  "security": {
    "consent_verified": true,
    "privacy": "Pll masked at edge via AES-256"
  }
}`}
                    </pre>
                    <button onClick={() => setStep(5)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-medium transition-colors">Generate Final Result</button>
                  </div>
                )}

                {step === 5 && (
                  <div className="text-center space-y-6 animate-in zoom-in duration-500 py-6">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
                      <CheckCircle2 className="w-20 h-20 text-emerald-500 relative z-10"/>
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-800">Eligible & Approved</h2>
                      <p className="text-sm text-slate-500 mt-1">Your multi-agent verification completed successfully.</p>
                    </div>
                    
                    <div className="bg-slate-50 p-6 border border-slate-200 rounded-xl text-left text-sm space-y-3 shadow-sm max-w-sm mx-auto">
                      <div className="flex justify-between border-b pb-2"><span className="text-slate-500">App ID:</span><span className="font-mono font-bold text-blue-600">HS-2026-88421</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Service:</span><span className="font-medium">{formData.scheme}</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Applicant:</span><span className="font-medium">{formData.name || "Citizen"}</span></div>
                      <div className="flex justify-between pt-1"><span className="text-slate-500">Status:</span><span className="text-emerald-600 font-bold">Auto-Approved</span></div>
                    </div>
                    
                    <button onClick={() => { setStep(1); setFormData({name: "", dob: "", scheme: "Housing Scheme Eligibility", consent: false}); }} className="w-full max-w-sm mx-auto bg-slate-100 hover:bg-slate-200 text-slate-800 py-3.5 rounded-xl text-sm font-medium transition-colors border border-slate-300">
                      Start New Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: ADMIN DASHBOARD */}
          {currentView === "admin" && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Department Oversight</h1>
                <p className="text-sm text-slate-500">Monitor active cross-department AI validations in real-time.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h2 className="font-semibold text-slate-700">Live Interoperability Queue</h2>
                    <span className="text-xs bg-white border px-2 py-1 rounded text-slate-500">Auto-refresh active</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-slate-400 border-b">
                        <tr><th className="p-4 font-medium">App ID</th><th className="p-4 font-medium">Name</th><th className="p-4 font-medium">Service</th><th className="p-4 font-medium">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50">
                          <td className="p-4 font-mono text-slate-900">HS-2026-88421</td><td className="p-4 font-medium">Verified Citizen</td><td className="p-4 text-slate-600">Housing Scheme</td>
                          <td className="p-4"><span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-medium">✓ Cleared</span></td>
                        </tr>
                        <tr className="bg-red-50/30 hover:bg-red-50/50">
                          <td className="p-4 font-mono text-slate-900">IC-2026-11234</td><td className="p-4 font-medium">John Doe</td><td className="p-4 text-slate-600">Income Cert</td>
                          <td className="p-4"><span className="bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-medium">⚠️ Anomaly</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-800 border-b pb-3 mb-4 text-sm flex justify-between">
                      AI Agent Flag 
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px]">Action Required</span>
                    </h2>
                    <div className="p-4 bg-slate-50 border rounded-xl text-xs text-slate-700 space-y-3">
                      <p><strong className="text-slate-900">Issue: IC-2026-11234</strong></p>
                      <p>Validation Agent detected a name mismatch between external databases.</p>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between bg-white p-2.5 rounded border border-red-200"><span className="text-slate-500">Revenue DB:</span><span className="font-medium text-red-600">J. Doe</span></div>
                        <div className="flex justify-between bg-white p-2.5 rounded border border-slate-200"><span className="text-slate-500">Identity DB:</span><span className="font-medium">John Doe</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-6">
                    <button className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-medium text-xs hover:bg-blue-700 transition">Approve Exception</button>
                    <button className="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-xl font-medium text-xs hover:bg-slate-50 transition">Reject</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: CHAT INQUIRY */}
          {currentView === "chat" && (
            <div className="max-w-3xl mx-auto h-[600px] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
              <div className="bg-slate-900 p-4 text-white font-bold flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg"><MessageSquare className="w-5 h-5"/></div>
                <div>
                  <div className="text-sm">Citizen Support AI</div>
                  <div className="text-[10px] text-slate-400 font-normal flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Online</div>
                </div>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={(e) => { e.preventDefault(); if(chatInput) { setMessages([...messages, {role:"user", text:chatInput}]); setChatInput(""); } }} className="flex gap-2">
                  <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} className="flex-1 border border-slate-300 bg-slate-50 p-3.5 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm" placeholder="Ask about scheme eligibility or status..."/>
                  <button type="submit" disabled={!chatInput} className="bg-blue-600 text-white p-3.5 rounded-xl disabled:opacity-50 hover:bg-blue-700 transition-colors"><Send className="w-5 h-5"/></button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}