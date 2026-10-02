improved link v3 



"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Landmark, Shield, LayoutDashboard, FileText, MessageSquare, LogOut,
  Activity, Send, CheckCircle2, AlertTriangle, Server, Check, Loader2,
  Lock, ChevronRight, UserCircle, Database, Network, Search, Globe, 
  Paperclip, Mic, Building, Users, Clock, Filter, RefreshCw
} from "lucide-react";

// --- SUPABASE INIT ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ciwhmfbpydwqfjmphzfc.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_CWdbGlLgthJSW";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const REAL_SERVICES = [
  "Senior Citizen Registration",
  "Online Marriage Registration",
  "Ayushman Bharat Card",
  "PAN Card Services",
  "Jeevan Pramaan (Life Certificate)",
  "Housing Scheme Eligibility",
  "Income Certificate Issuance"
];

// Mock data for the Department Dashboard
const MOCK_REQUESTS = [
  { id: "TXN-IND-88421", name: "Ramesh Kumar", service: "Ayushman Bharat Card", status: "Cleared", date: "2023-10-24" },
  { id: "TXN-IND-11234", name: "John Doe", service: "Income Certificate Issuance", status: "Anomaly", date: "2023-10-24" },
  { id: "TXN-IND-99321", name: "Priya Sharma", service: "PAN Card Services", status: "Pending AI", date: "2023-10-25" },
  { id: "TXN-IND-77210", name: "Anita Desai", service: "Housing Scheme Eligibility", status: "Cleared", date: "2023-10-25" },
  { id: "TXN-IND-55432", name: "Vikram Singh", service: "Senior Citizen Registration", status: "Manual Review", date: "2023-10-26" },
  { id: "TXN-IND-33211", name: "Rahul Verma", service: "Ayushman Bharat Card", status: "Pending AI", date: "2023-10-26" },
  { id: "TXN-IND-44110", name: "Sneha Patil", service: "Income Certificate Issuance", status: "Cleared", date: "2023-10-27" }
];

const TRANSLATIONS: any = {
  English: {
    portalAccess: "Official Portal Access",
    citizenPortal: "Citizen Portal",
    deptOfficial: "Dept Official",
    citizenServices: "Citizen Services",
    deptDashboard: "Department Oversight",
    aiMitra: "Sarkar Mitra AI",
    searchPlaceholder: "Search for Services, Schemes, or Keywords...",
    trending: "Trending Searches:",
    selectScheme: "Target Scheme",
    applicantName: "Applicant Full Name",
    proceedConsent: "Proceed to Consent",
    signOut: "Sign Out",
    welcome: "Namaste. I am Sarkar Mitra, your AI guide. How can I assist you with government services today?",
    askEligibility: "Ask about scheme eligibility...",
    nationalPortal: "National Portal of India"
  },
  Hindi: {
    portalAccess: "आधिकारिक पोर्टल एक्सेस",
    citizenPortal: "नागरिक पोर्टल",
    deptOfficial: "विभागीय अधिकारी",
    citizenServices: "नागरिक सेवाएं",
    deptDashboard: "विभाग अवलोकन",
    aiMitra: "सरकार मित्र AI",
    searchPlaceholder: "सेवाओं, योजनाओं या कीवर्ड खोजें...",
    trending: "ट्रेंडिंग खोजें:",
    selectScheme: "लक्षित योजना",
    applicantName: "आवेदक का पूरा नाम",
    proceedConsent: "सहमति के लिए आगे बढ़ें",
    signOut: "साइन आउट",
    welcome: "नमस्ते। मैं सरकार मित्र हूँ, आपका AI मार्गदर्शक। मैं आज सरकारी सेवाओं में आपकी कैसे मदद कर सकता हूँ?",
    askEligibility: "योजना पात्रता के बारे में पूछें...",
    nationalPortal: "भारत का राष्ट्रीय पोर्टल"
  },
  Marathi: {
    portalAccess: "अधिकृत पोर्टल प्रवेश",
    citizenPortal: "नागरिक पोर्टल",
    deptOfficial: "विभागीय अधिकारी",
    citizenServices: "नागरिक सेवा",
    deptDashboard: "विभाग देखरेख",
    aiMitra: "सरकार मित्र AI",
    searchPlaceholder: "सेवा, योजना किंवा कीवर्ड शोधा...",
    trending: "ट्रेंडिंग शोध:",
    selectScheme: "लक्ष्य योजना",
    applicantName: "अर्जदाराचे पूर्ण नाव",
    proceedConsent: "संमतीसाठी पुढे जा",
    signOut: "साइन आउट",
    welcome: "नमस्कार. मी सरकार मित्र आहे, तुमचा AI मार्गदर्शक. मी आज तुम्हाला सरकारी सेवांमध्ये कशी मदत करू शकतो?",
    askEligibility: "योजना पात्रतेबद्दल विचारा...",
    nationalPortal: "भारताचे राष्ट्रीय पोर्टल"
  },
  Kannada: {
    portalAccess: "ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಪ್ರವೇಶ",
    citizenPortal: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
    deptOfficial: "ಇಲಾಖಾ ಅಧಿಕಾರಿ",
    citizenServices: "ನಾಗರಿಕ ಸೇವೆಗಳು",
    deptDashboard: "ಇಲಾಖೆಯ ಮೇಲ್ವಿಚಾರಣೆ",
    aiMitra: "ಸರ್ಕಾರ್ ಮಿತ್ರ AI",
    searchPlaceholder: "ಸೇವೆಗಳು, ಯೋಜನೆಗಳು ಅಥವಾ ಕೀವರ್ಡ್‌‌ಗಳನ್ನು ಹುಡುಕಿ...",
    trending: "ಟ್ರೆಂಡಿಂಗ್ ಹುಡುಕಾಟಗಳು:",
    selectScheme: "ಗುರಿ ಯೋಜನೆ",
    applicantName: "ಅರ್ಜಿದಾರರ ಪೂರ್ಣ ಹೆಸರು",
    proceedConsent: "ಸಮ್ಮತಿಗೆ ಮುಂದುವರಿಯಿರಿ",
    signOut: "ಸೈನ್ ಔಟ್",
    welcome: "ನಮಸ್ಕಾರ. ನಾನು ಸರ್ಕಾರ್ ಮಿತ್ರ, ನಿಮ್ಮ AI ಮಾರ್ಗದರ್ಶಿ. ಸರ್ಕಾರಿ ಸೇವೆಗಳೊಂದಿಗೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    askEligibility: "ಯೋಜನೆಯ ಅರ್ಹತೆಯ ಬಗ್ಗೆ ಕೇಳಿ...",
    nationalPortal: "ಭಾರತದ ರಾಷ್ಟ್ರೀಯ ಪೋರ್ಟಲ್"
  }
};

export default function SarkarSevaApp() {
  const [session, setSession] = useState<any>(null);
  const [currentView, setCurrentView] = useState("services");
  const [userRole, setUserRole] = useState<"citizen" | "official">("citizen");
  const [globalLang, setGlobalLang] = useState("English");
  
  const t = TRANSLATIONS[globalLang];

  // Auth State
  const [loginTab, setLoginTab] = useState<"citizen" | "official">("citizen");
  const [authMode, setAuthMode] = useState<"email" | "phone">("email");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // CAPTCHA State
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  // Workflow State
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", dob: "", scheme: "Ayushman Bharat Card", consent: false });
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [activeAgent, setActiveAgent] = useState("");
  const [txId, setTxId] = useState("");
  const workflowRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Admin Dashboard State
  const [selectedAdminFilter, setSelectedAdminFilter] = useState<string>("All Services");

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([{ role: "agent", text: TRANSLATIONS.English.welcome }]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Generate a secure verification CAPTCHA
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous characters (O, 0, I, 1)
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        const savedRole = (localStorage.getItem("sarkarRole") as "citizen" | "official") || "citizen";
        setUserRole(savedRole);
        setCurrentView(savedRole === "official" ? "admin" : "services");
      }
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMessages([{ role: "agent", text: t.welcome }]);
  }, [globalLang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    // Verify CAPTCHA
    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setAuthError("Incorrect CAPTCHA verification code. Please try again.");
      generateCaptcha();
      return;
    }

    setAuthLoading(true);
    try {
      const { error } = authMode === "email"
        ? await supabase.auth.signInWithOtp({ email: contact })
        : await supabase.auth.signInWithOtp({ phone: contact });
      if (error) throw error;
      setOtpSent(true);
    } catch (err: any) {
      setAuthError(err.message);
      generateCaptcha();
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
      
      localStorage.setItem("sarkarRole", loginTab);
      setUserRole(loginTab);
      setCurrentView(loginTab === "official" ? "admin" : "services");
      setSession(data.session);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const triggerServiceWorkflow = (serviceName: string) => {
    setFormData({ ...formData, scheme: serviceName });
    setStep(1);
    setSearchQuery("");
    setShowSuggestions(false);
    workflowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setChatLoading(true);

    setTimeout(() => {
      let reply = `I have securely checked the departmental knowledge base. Can you provide more details so I can route your request accurately?`;
      if (userMsg.toLowerCase().includes("housing") || userMsg.toLowerCase().includes("scheme")) {
        reply = "For the Housing Scheme, our agents will cross-verify your Income Certificate and Land Records. You can start the application in the 'Citizen Services' tab.";
      } else if (userMsg.toLowerCase().includes("status")) {
        reply = "To check your status, I am pinging the Routing Agent... Your last application is currently marked as 'Cleared' by the AI Validation Agent.";
      }
      setMessages(prev => [...prev, { role: "agent", text: reply }]);
      setChatLoading(false);
    }, 1800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setMessages(prev => [...prev, { role: "user", text: `[Document Uploaded: ${file.name}]` }]);
    setChatLoading(true);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "agent", text: "Document received and passed to the OCR Agent. Data has been securely extracted and masked." }]);
      setChatLoading(false);
    }, 2000);
  };

  const simulateVoice = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setChatInput("How do I apply for a PAN card?");
      }, 2500);
    }
  };

  const filteredServices = REAL_SERVICES.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const filteredAdminRequests = selectedAdminFilter === "All Services" 
    ? MOCK_REQUESTS 
    : MOCK_REQUESTS.filter(req => req.service === selectedAdminFilter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Cleared": return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> {status}</span>;
      case "Anomaly": return <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {status}</span>;
      case "Pending AI": return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1"><Activity className="w-3 h-3"/> {status}</span>;
      case "Manual Review": return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1"><Clock className="w-3 h-3"/> {status}</span>;
      default: return <span>{status}</span>;
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex font-sans">
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#002147] text-white p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 flex">
            <div className="h-full w-1/3 bg-[#FF9933]"></div>
            <div className="h-full w-1/3 bg-white"></div>
            <div className="h-full w-1/3 bg-[#138808]"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#002147] shadow-xl">
              <Landmark size={36} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">SARKAR SEVA</h1>
              <p className="text-sm text-slate-300 font-mono tracking-widest uppercase">Government of Maharashtra</p>
            </div>
          </div>

          <div className="relative z-10">
            <h2 className="text-5xl font-extrabold leading-tight mb-6">
              Next-Generation<br/>GovTech Interoperability
            </h2>
            <p className="text-lg text-slate-300 max-w-md leading-relaxed">
              Powered by a secure LangGraph multi-agent swarm. We ensure transparent, automated, and tamper-proof citizen services.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col p-8 bg-white relative overflow-y-auto">
          <div className="absolute top-4 right-8 z-50">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <Globe className="w-4 h-4 text-slate-500" />
              <select value={globalLang} onChange={(e) => setGlobalLang(e.target.value)} className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer">
                <option>English</option>
                <option>Hindi</option>
                <option>Marathi</option>
                <option>Kannada</option>
              </select>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center py-8">
            <div className="w-full max-w-md space-y-6">
              <div className="text-center lg:text-left mb-4">
                <h2 className="text-3xl font-bold text-slate-900">{t.portalAccess}</h2>
                <p className="text-sm text-slate-500 mt-2">Select your portal and authenticate via secure OTP.</p>
              </div>

              <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                <button onClick={() => { setLoginTab("citizen"); setOtpSent(false); generateCaptcha(); }} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${loginTab === "citizen" ? "bg-white text-blue-800 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}>
                  <Users className="w-4 h-4"/> {t.citizenPortal}
                </button>
                <button onClick={() => { setLoginTab("official"); setOtpSent(false); generateCaptcha(); }} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${loginTab === "official" ? "bg-white text-emerald-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}>
                  <Building className="w-4 h-4"/> {t.deptOfficial}
                </button>
              </div>

              {authError && (
                <div className="p-4 bg-red-50 border-l-4 border-red-600 text-red-700 text-sm flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0" /><span>{authError}</span>
                </div>
              )}

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {loginTab === "citizen" && (
                    <div className="bg-slate-50 p-1.5 rounded-xl flex text-sm font-medium border border-slate-200 mb-2">
                      <button type="button" onClick={() => setAuthMode("email")} className={`flex-1 py-2 rounded-lg transition-all ${authMode === "email" ? "bg-white text-blue-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}>Email OTP</button>
                      <button type="button" onClick={() => setAuthMode("phone")} className={`flex-1 py-2 rounded-lg transition-all ${authMode === "phone" ? "bg-white text-blue-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}>Mobile OTP</button>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {loginTab === "official" ? "Official Govt Email (.gov.in)" : authMode === "email" ? "Registered Email" : "Registered Mobile (+91)"}
                    </label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type={authMode === "email" || loginTab === "official" ? "email" : "tel"} 
                        required placeholder={loginTab === "official" ? "officer@maharashtra.gov.in" : authMode === "email" ? "citizen@example.com" : "+91..."} 
                        value={contact} onChange={e => setContact(e.target.value)} 
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                      />
                    </div>
                  </div>

                  {/* CAPTCHA SECTION */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Security Verification</label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-4 py-3 select-none font-mono text-xl font-extrabold tracking-[0.3em] text-slate-800 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 flex items-center justify-center shadow-inner relative overflow-hidden">
                        <span className="line-through decoration-blue-600/70 decoration-2 italic">{captchaCode}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={generateCaptcha} 
                        className="p-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-600 transition-all flex items-center justify-center"
                        title="Refresh CAPTCHA"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      required 
                      maxLength={5}
                      placeholder="Enter the 5 characters above" 
                      value={captchaInput} 
                      onChange={e => setCaptchaInput(e.target.value)} 
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono uppercase tracking-widest focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                    />
                  </div>

                  <button disabled={authLoading} className={`w-full text-white py-3.5 rounded-xl font-medium flex justify-center items-center gap-2 transition-all disabled:opacity-70 mt-2 ${loginTab === 'official' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-[#002147] hover:bg-blue-900'}`}>
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
                  <button disabled={authLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium flex justify-center transition-all disabled:opacity-70">
                    {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Authenticate"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <aside className="w-64 bg-[#002147] text-slate-300 flex flex-col hidden md:flex border-r border-slate-800">
        <div className="h-1 w-full flex">
            <div className="h-full w-1/3 bg-[#FF9933]"></div>
            <div className="h-full w-1/3 bg-white"></div>
            <div className="h-full w-1/3 bg-[#138808]"></div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 text-white mb-1">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#002147]">
              <Landmark size={18} />
            </div>
            <span className="text-xl font-bold tracking-wide">SARKAR SEVA</span>
          </div>
          <div className="text-[10px] font-mono tracking-widest uppercase text-slate-400 pl-11">Maharashtra Portal</div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {userRole === "citizen" && (
            <button onClick={() => setCurrentView("services")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "services" ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "hover:bg-white/5 hover:text-white"}`}>
              <FileText className="w-5 h-5" /> <span className="font-medium text-sm">{t.citizenServices}</span>
            </button>
          )}
          {userRole === "official" && (
            <button onClick={() => setCurrentView("admin")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "admin" ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" : "hover:bg-white/5 hover:text-white"}`}>
              <LayoutDashboard className="w-5 h-5" /> <span className="font-medium text-sm">{t.deptDashboard}</span>
            </button>
          )}
          <button onClick={() => setCurrentView("chat")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "chat" ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "hover:bg-white/5 hover:text-white"}`}>
            <MessageSquare className="w-5 h-5" /> <span className="font-medium text-sm">{t.aiMitra}</span>
          </button>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> {t.signOut}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 flex flex-col border border-slate-200 rounded-sm overflow-hidden shadow-sm">
              <div className="h-1/3 bg-[#FF9933]"></div>
              <div className="h-1/3 bg-white flex items-center justify-center"><div className="w-1 h-1 bg-[#000080] rounded-full"></div></div>
              <div className="h-1/3 bg-[#138808]"></div>
            </div>
             <h2 className="text-lg font-bold text-slate-800 ml-2">
              {currentView === "services" ? t.nationalPortal : currentView === "admin" ? t.deptDashboard : t.aiMitra}
             </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <Globe className="w-4 h-4 text-slate-500" />
              <select value={globalLang} onChange={(e) => setGlobalLang(e.target.value)} className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer">
                <option>English</option>
                <option>Hindi</option>
                <option>Marathi</option>
                <option>Kannada</option>
              </select>
            </div>
            <button onClick={() => supabase.auth.signOut()} className="md:hidden text-slate-500 hover:text-slate-800"><LogOut className="w-5 h-5"/></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-100">
          
          {/* VIEW 1: CITIZEN PORTAL */}
          {currentView === "services" && (
            <div>
              <div className="bg-[#002147] text-white py-12 px-6 shadow-md relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
                  <h1 className="text-3xl font-bold tracking-wide">{t.nationalPortal}</h1>
                  <p className="text-blue-200 font-medium text-sm uppercase tracking-widest">Where Government Information Converges</p>
                  
                  <div className="flex flex-col sm:flex-row gap-2 mt-6 relative">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder={t.searchPlaceholder} 
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-slate-900 placeholder-slate-500 outline-none text-lg shadow-lg focus:ring-4 focus:ring-blue-500/50"
                      />
                      {showSuggestions && searchQuery && filteredServices.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                          {filteredServices.map(s => (
                            <button key={s} onClick={() => triggerServiceWorkflow(s)} className="w-full text-left px-6 py-3 text-slate-700 hover:bg-slate-50 border-b border-slate-100 last:border-0 font-medium transition-colors">
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-colors">
                      Search
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap justify-center items-center gap-3 pt-4 text-sm text-blue-200">
                    <span className="font-semibold text-white">{t.trending}</span>
                    {REAL_SERVICES.slice(0, 5).map(service => (
                      <button key={service} onClick={() => triggerServiceWorkflow(service)} className="hover:text-white underline underline-offset-4 decoration-blue-500/50 hover:decoration-white transition-colors">
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="max-w-4xl mx-auto p-4 md:p-8" ref={workflowRef}>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-4">
                  <div className="bg-slate-50 border-b border-slate-200 px-2 py-3 flex overflow-x-auto scrollbar-hide">
                    {["Request", "Consent", "Agent Swarm", "Data Ledger", "Result"].map((lbl, i) => (
                      <div key={lbl} className={`flex-1 min-w-[120px] text-center px-2 py-2 border-b-2 transition-all duration-300 ${step >= i + 1 ? "border-blue-600 text-blue-700" : "border-transparent text-slate-400"}`}>
                        <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${step >= i + 1 ? "text-blue-600" : "text-slate-400"}`}>Step 0{i + 1}</div>
                        <div className="text-sm font-medium">{lbl}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 md:p-10 min-h-[450px]">
                    {step === 1 && (
                      <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-500">
                        <div className="text-center mb-8">
                          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="w-6 h-6" /></div>
                          <h3 className="text-2xl font-bold text-slate-900">Application Details</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t.selectScheme}</label>
                            <select value={formData.scheme} onChange={e => setFormData({...formData, scheme: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-900">
                              {REAL_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t.applicantName}</label>
                            <input type="text" placeholder="E.g. Ramesh Kumar" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3.5 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Secure Govt ID</label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input type="text" disabled value="[Aadhaar Redacted]" className="w-full pl-10 p-3.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl font-mono text-sm cursor-not-allowed" />
                            </div>
                            <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1"><Shield className="w-3 h-3"/> Edge-masked for strict privacy compliance.</p>
                          </div>
                          <button onClick={() => setStep(2)} className="w-full bg-[#002147] hover:bg-blue-900 text-white py-4 rounded-xl font-medium mt-4 transition-colors shadow-md flex items-center justify-center gap-2">
                            {t.proceedConsent} <ChevronRight className="w-4 h-4"/>
                          </button>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="max-w-xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-500">
                         <div className="text-center mb-8">
                          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4"><Shield className="w-6 h-6" /></div>
                          <h3 className="text-2xl font-bold text-slate-900">Digital Authorization</h3>
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

                    {step === 3 && (
                      <div className="max-w-2xl mx-auto text-center space-y-10 animate-in fade-in duration-500 py-8">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">Swarm Orchestration</h3>
                        </div>

                        <div className="relative">
                          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto relative z-10 border-4 border-white shadow-xl">
                            <Network className="w-10 h-10 text-blue-600 animate-pulse" />
                          </div>
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

                    {step === 4 && (
                      <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                          <Server className="w-8 h-8 text-slate-700" />
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">Interoperability Ledger</h3>
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
  "workflow": "${formData.scheme.replace(/\s+/g, '_')}",
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
  }
}`}
                          </pre>
                        </div>
                        <button onClick={() => setStep(5)} className="w-full bg-[#002147] hover:bg-blue-900 text-white py-4 rounded-xl font-medium transition-colors shadow-md flex justify-center items-center gap-2">
                          Generate Final Decision Certificate <FileText className="w-4 h-4"/>
                        </button>
                      </div>
                    )}

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
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Final Status</span>
                            <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Verified</span>
                          </div>
                        </div>
                        
                        <button onClick={() => { setStep(1); setFormData({name: "", dob: "", scheme: "Ayushman Bharat Card", consent: false}); }} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-xl font-medium transition-colors border border-slate-300">
                          Start New Application
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: DEPT DASHBOARD  */}
          {currentView === "admin" && (
            <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.deptDashboard}</h1>
                
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                  <Filter className="w-5 h-5 text-slate-400" />
                  <select 
                    value={selectedAdminFilter} 
                    onChange={(e) => setSelectedAdminFilter(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-slate-800 outline-none cursor-pointer w-full md:w-64"
                  >
                    <option value="All Services">View All Department Services</option>
                    {REAL_SERVICES.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-sm font-semibold mb-1">Total Requests</div>
                  <div className="text-3xl font-black text-slate-900">{filteredAdminRequests.length}</div>
                </div>
                <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 shadow-sm">
                  <div className="text-emerald-700 text-sm font-semibold mb-1">Cleared by AI</div>
                  <div className="text-3xl font-black text-emerald-800">{filteredAdminRequests.filter(r => r.status === "Cleared").length}</div>
                </div>
                <div className="bg-red-50 p-5 rounded-xl border border-red-100 shadow-sm">
                  <div className="text-red-700 text-sm font-semibold mb-1">Anomalies Detected</div>
                  <div className="text-3xl font-black text-red-800">{filteredAdminRequests.filter(r => r.status === "Anomaly").length}</div>
                </div>
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm">
                  <div className="text-blue-700 text-sm font-semibold mb-1">Processing Swarm</div>
                  <div className="text-3xl font-black text-blue-800">{filteredAdminRequests.filter(r => r.status === "Pending AI" || r.status === "Manual Review").length}</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                  <h2 className="font-bold text-slate-800 flex items-center gap-2"><Database className="w-4 h-4 text-blue-600"/> Live Transaction Queue</h2>
                  <div className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-widest">
                    {selectedAdminFilter}
                  </div>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
                      <tr>
                        <th className="px-6 py-4">Transaction ID</th>
                        <th className="px-6 py-4">Applicant</th>
                        <th className="px-6 py-4">Service Type</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Agent Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAdminRequests.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                            No requests found for {selectedAdminFilter}.
                          </td>
                        </tr>
                      ) : (
                        filteredAdminRequests.map((req, idx) => (
                          <tr key={idx} className={`transition-colors ${req.status === "Anomaly" ? "bg-red-50/30 hover:bg-red-50/50 border-l-4 border-l-red-500" : "hover:bg-slate-50"}`}>
                            <td className="px-6 py-4 font-mono font-medium text-slate-700">{req.id}</td>
                            <td className="px-6 py-4 font-semibold text-slate-900">{req.name}</td>
                            <td className="px-6 py-4 text-slate-600">{req.service}</td>
                            <td className="px-6 py-4 text-slate-500">{req.date}</td>
                            <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-blue-600 hover:text-blue-800 font-bold text-xs underline underline-offset-2">View File</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: AI MITRA CHAT   */}
          {currentView === "chat" && (
            <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[75vh] min-h-[500px] overflow-hidden">
                <div className="bg-[#002147] p-4 flex items-center gap-3 shrink-0 text-white">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center border-2 border-blue-400/30 shadow-lg">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold tracking-wide">{t.aiMitra}</h2>
                    <p className="text-[10px] text-blue-200 uppercase tracking-widest font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> Active Support Agent
                    </p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                        msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
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
                
                <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                  <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                    
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Upload Document">
                      <Paperclip className="w-5 h-5" />
                    </button>

                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={chatInput} 
                        onChange={e => setChatInput(e.target.value)} 
                        placeholder={isRecording ? "Listening..." : t.askEligibility} 
                        className={`w-full border rounded-xl px-4 py-3.5 outline-none text-sm text-slate-900 transition-all ${isRecording ? "bg-red-50 border-red-200 placeholder-red-400" : "bg-slate-50 border-slate-300 focus:ring-2 focus:ring-blue-600 focus:bg-white"}`}
                        disabled={chatLoading || isRecording}
                      />
                    </div>

                    <button type="button" onClick={simulateVoice} className={`p-3 rounded-xl transition-all shadow-sm border ${isRecording ? "bg-red-100 text-red-600 border-red-200 animate-pulse" : "bg-white text-slate-500 hover:text-blue-600 hover:bg-slate-50 border-slate-200"}`} title="Voice Input">
                      <Mic className="w-5 h-5" />
                    </button>

                    <button type="submit" disabled={!chatInput.trim() || chatLoading} className="bg-[#002147] hover:bg-blue-900 text-white p-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center">
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}