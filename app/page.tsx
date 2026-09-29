"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Landmark, Shield, LayoutDashboard, FileText, MessageSquare, LogOut,
  Activity, Send, CheckCircle2, AlertTriangle, Server, Check, Loader2,
  Lock, ChevronRight, UserCircle, Database, Network
} from "lucide-react";

// --- SUPABASE INIT ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ciwhmfbpydwqfjmphzfc.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_CWdbGlLgthJSW";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SarkarSevaApp() {
  // --- STATE MANAGEMENT ---
  const [session, setSession] = useState<any>(null);
  const [currentView, setCurrentView] = useState("services");

  // Auth State
  const [authMode, setAuthMode] = useState<"email" | "phone">("email");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Workflow State (5 Steps)
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", dob: "", scheme: "Housing Scheme Eligibility", consent: false });
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [activeAgent, setActiveAgent] = useState("");
  const [txId, setTxId] = useState("");

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "agent", text: "Namaste. I am Sarkar Mitra, your AI guide. How can I assist you with government services today?" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- EFFECTS ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- AUTH HANDLERS ---
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true); setAuthError("");
    try {
      const { error } = authMode === "email"
        ? await supabase.auth.signInWithOtp({ email: contact })
        : await supabase.auth.signInWithOtp({ phone: contact });
      if (error) throw error;
      setOtpSent(true);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true); setAuthError("");
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        [authMode === "email" ? "email" : "phone"]: contact,
        token: otp,
        type: authMode === "email" ? "email" : "sms"
      } as any);
      if (error) throw error;
      setSession(data.session);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // --- WORKFLOW SIMULATION ---
  const runPipeline = () => {
    setStep(3);
    setPipelineProgress(0);
    const agents = [
      "1. Request Agent (Intent Extraction)",
      "2. Routing Agent (API Mapping)",
      "3. Data Agents (Cross-System Fetch)",
      "4. Validation Agent (Anomaly Check)",
      "5. Consent & Security Agent",
      "6. Response Agent (Payload Formatting)"
    ];
    let i = 0;
    const timer = setInterval(() => {
      setActiveAgent(agents[i]);
      setPipelineProgress(((i + 1) / agents.length) * 100);
      i++;
      if (i >= agents.length) {
        clearInterval(timer);
        setTxId(`TXN-IND-${Math.floor(100000 + Math.random() * 900000)}`);
        setTimeout(() => setStep(4), 1200);
      }
    }, 1500);
  };

  // --- CHAT SIMULATION ---
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setChatLoading(true);

    // Simulate Agent processing
    setTimeout(() => {
      let reply = "I have securely checked the departmental knowledge base. Can you provide more details so I can route your request accurately?";
      if (userMsg.toLowerCase().includes("housing") || userMsg.toLowerCase().includes("scheme")) {
        reply = "For the Housing Scheme, our agents will cross-verify your Income Certificate and Land Records. You can start the application in the 'Citizen Services' tab.";
      } else if (userMsg.toLowerCase().includes("status")) {
        reply = "To check your status, I am pinging the Routing Agent... Your last application is currently marked as 'Cleared' by the AI Validation Agent.";
      }
      setMessages(prev => [...prev, { role: "agent", text: reply }]);
      setChatLoading(false);
    }, 1800);
  };

  // ==========================================
  // VIEW: UNAUTHENTICATED (LOGIN PORTAL)
  // ==========================================
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex font-sans">
        {/* Left Side: Govt Branding */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0f172a] text-white p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-white to-green-500 opacity-80"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <Landmark className="w-10 h-10 text-orange-400" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">SARKAR SEVA</h1>
                <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">Government of India</p>
              </div>
            </div>
            
            <h2 className="text-5xl font-extrabold leading-tight mb-6">
              Next-Generation<br/>GovTech Interoperability
            </h2>
            <p className="text-lg text-slate-300 max-w-md leading-relaxed">
              Powered by a secure LangGraph multi-agent swarm. We ensure transparent, automated, and tamper-proof citizen services.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-6 mt-12">
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
              <Network className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="font-semibold mb-1">Multi-Agent Swarm</h3>
              <p className="text-xs text-slate-400">7 dedicated AI agents handling request routing and validation.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
              <Shield className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="font-semibold mb-1">Privacy First</h3>
              <p className="text-xs text-slate-400">Strict AES-256 edge masking for all sensitive identifiers.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-blue-600 to-green-500 lg:hidden"></div>
          
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900">Official Portal Access</h2>
              <p className="text-sm text-slate-500 mt-2">Authenticate via secure OTP to access your dashboard.</p>
            </div>

            {authError && (
              <div className="p-4 bg-red-50 border-l-4 border-red-600 text-red-700 text-sm flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="bg-slate-50 p-1.5 rounded-xl flex text-sm font-medium border border-slate-200">
              <button onClick={() => { setAuthMode("email"); setOtpSent(false); }} className={`flex-1 py-2.5 rounded-lg transition-all ${authMode === "email" ? "bg-white text-blue-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}>Email OTP</button>
              <button onClick={() => { setAuthMode("phone"); setOtpSent(false); }} className={`flex-1 py-2.5 rounded-lg transition-all ${authMode === "phone" ? "bg-white text-blue-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}>Mobile OTP</button>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {authMode === "email" ? "Registered Email" : "Registered Mobile (+91)"}
                  </label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type={authMode === "email" ? "email" : "tel"} required placeholder={authMode === "email" ? "citizen@example.com" : "+91..."} value={contact} onChange={e => setContact(e.target.value)} className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                  </div>
                </div>
                <button disabled={authLoading} className="w-full bg-[#0f172a] hover:bg-blue-900 text-white py-3.5 rounded-xl font-medium flex justify-center items-center gap-2 transition-all disabled:opacity-70">
                  {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-4 h-4"/> Request Secure OTP</>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 text-center">
                  Secure code sent to <strong>{contact}</strong>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Enter 6-Digit Code</label>
                  <input type="text" maxLength={6} required placeholder="· · · · · ·" value={otp} onChange={e => setOtp(e.target.value)} className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl text-center text-2xl tracking-[0.5em] font-mono text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                </div>
                <button disabled={authLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-medium flex justify-center transition-all disabled:opacity-70">
                  {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Authenticate"}
                </button>
                <button type="button" onClick={() => setOtpSent(false)} className="w-full text-sm text-slate-500 hover:text-slate-800 underline underline-offset-4">Wrong contact info? Go back</button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: AUTHENTICATED (MAIN APP)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col hidden md:flex border-r border-slate-800">
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-green-500"></div>
        <div className="p-6">
          <div className="flex items-center gap-3 text-white mb-1">
            <Landmark className="w-6 h-6 text-orange-400" />
            <span className="text-xl font-bold tracking-wide">SARKAR SEVA</span>
          </div>
          <div className="text-[10px] font-mono tracking-widest uppercase text-slate-500 pl-9">SIH 2026 Edition</div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button onClick={() => setCurrentView("services")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "services" ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "hover:bg-white/5 hover:text-white"}`}>
            <FileText className="w-5 h-5" /> <span className="font-medium text-sm">Citizen Services</span>
          </button>
          <button onClick={() => setCurrentView("admin")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "admin" ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" : "hover:bg-white/5 hover:text-white"}`}>
            <LayoutDashboard className="w-5 h-5" /> <span className="font-medium text-sm">Dept Dashboard</span>
          </button>
          <button onClick={() => setCurrentView("chat")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "chat" ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "hover:bg-white/5 hover:text-white"}`}>
            <MessageSquare className="w-5 h-5" /> <span className="font-medium text-sm">Sarkar Mitra AI</span>
          </button>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl mb-2">
            <UserCircle className="w-8 h-8 text-slate-400" />
            <div className="overflow-hidden">
              <div className="text-xs text-white truncate">{session.user.email || session.user.phone}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div> Verified</div>
            </div>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOP HEADER */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-lg font-bold text-slate-800 capitalize">
            {currentView === "services" ? "Welfare Services Portal" : currentView === "admin" ? "Department Oversight" : "AI Support Portal"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              LANGGRAPH SWARM ONLINE
            </div>
            <button onClick={() => supabase.auth.signOut()} className="md:hidden text-slate-500 hover:text-slate-800"><LogOut className="w-5 h-5"/></button>
          </div>
        </header>

        {/* SCROLLABLE VIEW CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">

          {/* ==========================================
              VIEW 1: CITIZEN SERVICES (5-STEP WORKFLOW)
              ========================================== */}
          {currentView === "services" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                
                {/* Progress Stepper */}
                <div className="bg-slate-50 border-b border-slate-200 px-2 py-3 flex overflow-x-auto scrollbar-hide">
                  {["Request", "Consent", "Agent Swarm", "Data Ledger", "Result"].map((lbl, i) => (
                    <div key={lbl} className={`flex-1 min-w-[120px] text-center px-2 py-2 border-b-2 transition-all duration-300 ${step >= i + 1 ? "border-blue-600 text-blue-700" : "border-transparent text-slate-400"}`}>
                      <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${step >= i + 1 ? "text-blue-600" : "text-slate-400"}`}>Step 0{i + 1}</div>
                      <div className="text-sm font-medium">{lbl}</div>
                    </div>
                  ))}
                </div>

                <div className="p-6 md:p-10 min-h-[450px]">
                  {/* STEP 1: Details */}
                  {step === 1 && (
                    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-500">
                      <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="w-6 h-6" /></div>
                        <h3 className="text-2xl font-bold text-slate-900">Application Details</h3>
                        <p className="text-sm text-slate-500 mt-2">Select a scheme. Our AI agents will handle the verification.</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Target Scheme</label>
                          <select value={formData.scheme} onChange={e => setFormData({...formData, scheme: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-medium">
                            <option>Housing Scheme Eligibility</option>
                            <option>Income Certificate Issuance</option>
                            <option>Ration Subsidy Request</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Applicant Full Name</label>
                          <input type="text" placeholder="E.g. Ramesh Kumar" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Secure Govt ID</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" disabled value="[Aadhaar Redacted]" className="w-full pl-10 p-3.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl font-mono text-sm cursor-not-allowed" />
                          </div>
                          <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1"><Shield className="w-3 h-3"/> Edge-masked for strict privacy compliance.</p>
                        </div>
                        <button onClick={() => setStep(2)} className="w-full bg-[#0f172a] hover:bg-blue-900 text-white py-4 rounded-xl font-medium mt-4 transition-colors shadow-md flex items-center justify-center gap-2">
                          Proceed to Consent <ChevronRight className="w-4 h-4"/>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Consent */}
                  {step === 2 && (
                    <div className="max-w-xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-500">
                       <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4"><Shield className="w-6 h-6" /></div>
                        <h3 className="text-2xl font-bold text-slate-900">Digital Authorization</h3>
                        <p className="text-sm text-slate-500 mt-2">Data Protection & Interoperability Gate</p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm text-slate-700 leading-relaxed shadow-inner">
                        <p className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Database className="w-4 h-4 text-blue-600"/> Automated Data Fetching Notice:</p>
                        <p>To process your <strong className="text-blue-700">{formData.scheme}</strong> request instantly, Sarkar Seva AI Agents will execute secure API queries across the following departments:</p>
                        <ul className="list-disc pl-5 mt-3 space-y-1 font-medium text-slate-600">
                          <li>State Revenue Department (Income Check)</li>
                          <li>Land Records Registry (Property Check)</li>
                          <li>Central Identity Portal (Verification)</li>
                        </ul>
                      </div>

                      <label className="flex items-start gap-4 p-4 border border-blue-200 bg-blue-50/50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
                        <input type="checkbox" checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} className="mt-1 w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-600" />
                        <span className="text-sm font-medium text-slate-800">I provide explicit digital consent authorizing the Sarkar Seva swarm to fetch and validate my departmental records for this transaction.</span>
                      </label>

                      <div className="flex gap-3 pt-4">
                        <button onClick={() => setStep(1)} className="px-6 py-4 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors">Back</button>
                        <button disabled={!formData.consent} onClick={runPipeline} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium transition-colors disabled:opacity-50 shadow-md flex items-center justify-center gap-2">
                          Authorize & Orchestrate Swarm <Activity className="w-4 h-4"/>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Swarm Execution */}
                  {step === 3 && (
                    <div className="max-w-2xl mx-auto text-center space-y-10 animate-in fade-in duration-500 py-8">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">Swarm Orchestration</h3>
                        <p className="text-sm text-slate-500 mt-2">LangGraph agents are processing your application in real-time.</p>
                      </div>

                      <div className="relative">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto relative z-10 border-4 border-white shadow-xl">
                          <Network className="w-10 h-10 text-blue-600 animate-pulse" />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-400/20 rounded-full animate-ping"></div>
                      </div>

                      <div>
                        <div className="text-sm font-bold text-blue-700 bg-blue-50 inline-block px-4 py-1.5 rounded-full mb-4 border border-blue-200">
                          Executing: {activeAgent}
                        </div>
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner border border-slate-200">
                          <div className="bg-blue-600 h-full transition-all duration-300 ease-out relative" style={{width: `${pipelineProgress}%`}}>
                            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_1s_infinite]"></div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-left">
                        {["Request Agent", "Routing Agent", "Data Agent", "Validation Agent", "Security Agent", "Response Agent"].map((agent, idx) => (
                          <div key={idx} className={`p-3 rounded-lg border text-xs font-mono transition-all duration-500 ${pipelineProgress > (idx/6)*100 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                            <div className="flex justify-between items-center">
                              <span>{idx+1}. {agent}</span>
                              {pipelineProgress > (idx/6)*100 && <Check className="w-3 h-3 text-emerald-500"/>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Ledger/JSON */}
                  {step === 4 && (
                    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500">
                      <div className="flex items-center gap-3 mb-6">
                        <Server className="w-8 h-8 text-slate-700" />
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">Interoperability Ledger</h3>
                          <p className="text-xs text-slate-500">Raw API Payload from Departmental Data Fetch</p>
                        </div>
                      </div>

                      <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-slate-800">
                        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                          <span className="text-xs font-mono text-slate-400 ml-2">payload_response.json</span>
                        </div>
                        <pre className="p-6 text-[13px] font-mono text-emerald-400 overflow-x-auto">
{`{
  "transaction_id": "${txId}",
  "timestamp": "${new Date().toISOString()}",
  "workflow": "Housing_Scheme_Eligibility",
  "departments_queried": ["Revenue", "Identity"],
  "response": {
    "identity_verification": { 
      "status": 200, 
      "name_match": true,
      "uid_hash": "b2c9a...[REDACTED]"
    },
    "revenue_verification": { 
      "status": 200, 
      "income_threshold_met": true,
      "land_record_clear": true
    }
  },
  "ai_validation": {
    "anomaly_detected": false,
    "confidence_score": 0.99
  },
  "security": {
    "consent_verified": true,
    "encryption": "AES-256"
  }
}`}
                        </pre>
                      </div>
                      <button onClick={() => setStep(5)} className="w-full bg-[#0f172a] hover:bg-blue-900 text-white py-4 rounded-xl font-medium transition-colors shadow-md flex justify-center items-center gap-2">
                        Generate Final Decision Certificate <FileText className="w-4 h-4"/>
                      </button>
                    </div>
                  )}

                  {/* STEP 5: Success */}
                  {step === 5 && (
                    <div className="max-w-md mx-auto text-center space-y-6 animate-in zoom-in-95 duration-500 py-8">
                      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white">
                        <CheckCircle2 className="w-12 h-12" />
                      </div>
                      
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Approved</h2>
                        <p className="text-slate-500 mt-2">Your application passed AI verification successfully.</p>
                      </div>
                      
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-left space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -z-10"></div>
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Application ID</span>
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">{txId}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service</span>
                          <span className="font-semibold text-slate-800">{formData.scheme}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applicant</span>
                          <span className="font-semibold text-slate-800">{formData.name || "Citizen"}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Final Status</span>
                          <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Verified</span>
                        </div>
                      </div>
                      
                      <button onClick={() => { setStep(1); setFormData({name: "", dob: "", scheme: "Housing Scheme Eligibility", consent: false}); }} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-xl font-medium transition-colors border border-slate-300">
                        Start New Application
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* ==========================================
              VIEW 2: ADMIN DASHBOARD
              ========================================== */}
          {currentView === "admin" && (
            <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Department Oversight</h1>
                  <p className="text-slate-500 mt-1">Live monitoring of cross-department API transactions and AI Validation Flags.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Data Table */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2"><Database className="w-4 h-4 text-blue-600"/> Live Transaction Queue</h2>
                    <span className="text-xs font-medium bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm text-slate-500 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Auto-Sync
                    </span>
                  </div>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
                        <tr>
                          <th className="px-6 py-4">Transaction ID</th>
                          <th className="px-6 py-4">Applicant</th>
                          <th className="px-6 py-4">Service Type</th>
                          <th className="px-6 py-4">Agent Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-mono font-medium text-slate-700">TXN-IND-88421</td>
                          <td className="px-6 py-4 font-semibold text-slate-900">Verified Citizen</td>
                          <td className="px-6 py-4 text-slate-600">Housing Scheme</td>
                          <td className="px-6 py-4">
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3"/> Cleared
                            </span>
                          </td>
                        </tr>
                        <tr className="bg-red-50/30 hover:bg-red-50/50 transition-colors border-l-4 border-l-red-500">
                          <td className="px-6 py-4 font-mono font-medium text-slate-700">TXN-IND-11234</td>
                          <td className="px-6 py-4 font-semibold text-slate-900">John Doe</td>
                          <td className="px-6 py-4 text-slate-600">Income Cert</td>
                          <td className="px-6 py-4">
                            <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3"/> Anomaly
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* AI Review Card */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2"><Shield className="w-4 h-4 text-amber-500"/> Agent Flag Review</h2>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target ID</p>
                          <p className="font-mono font-bold text-slate-800">TXN-IND-11234</p>
                        </div>
                        <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide">Action Required</span>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">
                        The Validation Agent detected a discrepancy in cross-departmental records for applicant <strong className="text-slate-900">John Doe</strong>.
                      </p>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-red-200 shadow-sm">
                          <span className="text-xs font-bold text-slate-500">Revenue DB</span>
                          <span className="text-sm font-bold text-red-600">J. Doe</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                          <span className="text-xs font-bold text-slate-500">Identity DB</span>
                          <span className="text-sm font-bold text-slate-900">John Doe</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100">
                      <button className="flex-1 bg-[#0f172a] text-white py-3 rounded-xl font-medium text-sm hover:bg-blue-900 transition shadow-sm">Approve Override</button>
                      <button className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-medium text-sm hover:bg-slate-50 transition">Reject Request</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ==========================================
              VIEW 3: CHATBOT (SARKAR MITRA)
              ========================================== */}
          {currentView === "chat" && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[70vh] min-h-[500px] overflow-hidden animate-in fade-in">
              {/* Chat Header */}
              <div className="bg-[#0f172a] p-4 flex justify-between items-center shrink-0 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center border-2 border-blue-400/30 shadow-lg">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold tracking-wide">Sarkar Mitra AI</h2>
                    <p className="text-[10px] text-blue-200 uppercase tracking-widest font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> Active Support Agent
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {chatLoading && (
                  <div className="flex justify-start animate-in fade-in">
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-2 items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              
              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={e => setChatInput(e.target.value)} 
                    placeholder="Ask about scheme eligibility or track an application..." 
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-sm transition-all"
                    disabled={chatLoading}
                  />
                  <button type="submit" disabled={!chatInput.trim() || chatLoading} className="bg-[#0f172a] hover:bg-blue-900 text-white px-5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center">
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}