"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Building, User, FileText, CheckCircle2, Search, Shield, Activity, 
  Layers, ArrowRight, Home, List, HelpCircle, Check, Loader2, 
  Lock, ChevronRight, UserCircle, Database, Network, Globe, Paperclip, Mic, 
  Users, Clock, Filter, RefreshCw, Send, LayoutDashboard, MessageSquare, LogOut, AlertTriangle
} from "lucide-react";

// Translations mapping
const TRANSLATIONS: any = {
  English: {
    portalAccess: "Official Portal Access",
    citizenPortal: "Citizen Login",
    deptOfficial: "Official Login",
    citizenServices: "Home",
    deptDashboard: "Department Oversight",
    aiMitra: "Sarkar Mitra AI",
    searchPlaceholder: "e.g. Check my housing scheme eligibility...",
    trending: "Trending Searches:",
    applicantName: "Applicant Full Name",
    proceedConsent: "Proceed to Consent",
    signOut: "Sign Out",
    welcome: "Namaste. I am Sarkar Mitra, your AI guide. How can I assist you with government services today?",
    nationalPortal: "Sarkar Seva",
    popular: "Popular Services"
  },
  Hindi: {
    portalAccess: "आधिकारिक पोर्टल एक्सेस",
    citizenPortal: "नागरिक लॉगिन",
    deptOfficial: "अधिकारी लॉगिन",
    citizenServices: "होम",
    deptDashboard: "विभाग अवलोकन",
    aiMitra: "सरकार मित्र AI",
    searchPlaceholder: "जैसे, मेरी आवास योजना पात्रता की जांच करें...",
    trending: "ट्रेंडिंग खोजें:",
    applicantName: "आवेदक का पूरा नाम",
    proceedConsent: "सहमति के लिए आगे बढ़ें",
    signOut: "साइन आउट",
    welcome: "नमस्ते। मैं सरकार मित्र हूँ, आपका AI मार्गदर्शक। मैं आज आपकी कैसे मदद कर सकता हूँ?",
    nationalPortal: "सरकार सेवा",
    popular: "लोकप्रिय सेवाएं"
  },
  Marathi: {
    portalAccess: "अधिकृत पोर्टल प्रवेश",
    citizenPortal: "नागरिक लॉगिन",
    deptOfficial: "अधिकारी लॉगिन",
    citizenServices: "होम",
    deptDashboard: "विभाग देखरेख",
    aiMitra: "सरकार मित्र AI",
    searchPlaceholder: "उदा. माझी गृहनिर्माण योजना पात्रता तपासा...",
    trending: "ट्रेंडिंग शोध:",
    applicantName: "अर्जदाराचे पूर्ण नाव",
    proceedConsent: "संमतीसाठी पुढे जा",
    signOut: "साइन आउट",
    welcome: "नमस्कार. मी सरकार मित्र आहे. मी आज तुम्हाला कशी मदत करू शकतो?",
    nationalPortal: "सरकार सेवा",
    popular: "लोकप्रिय सेवा"
  },
  Kannada: {
    portalAccess: "ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಪ್ರವೇಶ",
    citizenPortal: "ನಾಗರಿಕ ಲಾಗಿನ್",
    deptOfficial: "ಅಧಿಕಾರಿ ಲಾಗಿನ್",
    citizenServices: "ಮುಖಪುಟ",
    deptDashboard: "ಇಲಾಖೆಯ ಮೇಲ್ವಿಚಾರಣೆ",
    aiMitra: "ಸರ್ಕಾರ್ ಮಿತ್ರ AI",
    searchPlaceholder: "ಉದಾ. ವಸತಿ ಯೋಜನೆ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ...",
    trending: "ಟ್ರೆಂಡಿಂಗ್:",
    applicantName: "ಅರ್ಜಿದಾರರ ಪೂರ್ಣ ಹೆಸರು",
    proceedConsent: "ಸಮ್ಮತಿಗೆ ಮುಂದುವರಿಯಿರಿ",
    signOut: "ಸೈನ್ ಔಟ್",
    welcome: "ನಮಸ್ಕಾರ. ನಾನು ಸರ್ಕಾರ್ ಮಿತ್ರ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    nationalPortal: "ಸರ್ಕಾರ್ ಸೇವಾ",
    popular: "ಜನಪ್ರಿಯ ಸೇವೆಗಳು"
  }
};

const REAL_SERVICES = [
  "Housing Scheme Eligibility",
  "Income Certificate Issuance",
  "Property Records Validation",
  "Senior Citizen Registration",
  "Ayushman Bharat Card",
  "PAN Card Services"
];

export default function SarkarSevaApp() {
  const [globalLang, setGlobalLang] = useState("English");
  const t = TRANSLATIONS[globalLang];

  // System State
  const [step, setStep] = useState(0); 
  const [currentView, setCurrentView] = useState("services"); 
  const [userRole, setUserRole] = useState<"citizen" | "official">("citizen");
  
  // Auth State
  const [loginTab, setLoginTab] = useState<"citizen" | "official">("citizen");
  const [authMode, setAuthMode] = useState<"mobile" | "email" | "aadhaar">("mobile");
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
  const [workflowStep, setWorkflowStep] = useState(0);
  const [orchestrationProgress, setOrchestrationProgress] = useState(-1);
  const [txId, setTxId] = useState("");
  const [activeScheme, setActiveScheme] = useState("");

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([{ role: "agent", text: TRANSLATIONS.English.welcome }]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptchaCode(code);
    setCaptchaInput("");
  };

  useEffect(() => { generateCaptcha(); }, []);
  useEffect(() => { setMessages([{ role: "agent", text: t.welcome }]); }, [globalLang]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Auth Functions
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setAuthError("Incorrect CAPTCHA. Please try again.");
      generateCaptcha();
      return;
    }
    
    setAuthLoading(true);

    try {
      /* 
        =========================================
        PINGRAM.IO INTEGRATION CODE (LIVE PROD)
        =========================================
        Uncomment the fetch block below and insert your Pingram API Key to send real emails.
      */
      
      if (authMode === 'email' || loginTab === 'official') {
        /*
        const response = await fetch("https://api.pingram.io/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer YOUR_PINGRAM_SECRET_KEY" 
          },
          body: JSON.stringify({
            to: contact,
            type: "otp_verification", 
            variables: { 
              otp_code: "123456", 
              user_name: "Citizen" 
            }
          })
        });

        if (!response.ok) throw new Error("Failed to send OTP via Pingram.");
        */
      }

      // Simulated delay for UI demonstration
      setTimeout(() => {
        setOtpSent(true);
        setAuthLoading(false);
      }, 1200);

    } catch (err: any) {
      setAuthError(err.message || "An error occurred.");
      generateCaptcha();
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setTimeout(() => {
      setUserRole(loginTab);
      setCurrentView(loginTab === "official" ? "admin" : "services");
      setStep(2); 
      setAuthLoading(false);
    }, 1000);
  };

  // Workflow Functions
  const startWorkflow = (scheme: string) => {
    setActiveScheme(scheme);
    setSearchQuery("");
    setShowSuggestions(false);
    setWorkflowStep(1); 
  };

  const startOrchestration = () => {
    setWorkflowStep(4);
    setTxId(`GV-${Math.floor(10000 + Math.random() * 90000)}`);
    setOrchestrationProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress++;
      setOrchestrationProgress(progress);
      if (progress >= 6) {
        clearInterval(interval);
        setTimeout(() => setWorkflowStep(5), 1200); 
      }
    }, 1200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", text: chatInput }]);
    setChatInput("");
    setChatLoading(true);

    setTimeout(() => {
      let reply = `I have securely checked the departmental knowledge base. Can you provide more details?`;
      if (chatInput.toLowerCase().includes("housing")) reply = "For the Housing Scheme, our agents will automatically cross-verify your Income Certificate and Land Records. You can start the application directly from the Home screen.";
      setMessages(prev => [...prev, { role: "agent", text: reply }]);
      setChatLoading(false);
    }, 1500);
  };

  const simulateVoice = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setChatInput("Check my housing scheme eligibility");
      }, 2500);
    }
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

  const filteredServices = REAL_SERVICES.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

  // ---------------------------------------------------------
  // SCREEN 0: LANDING PAGE (Exact Video Replica)
  // ---------------------------------------------------------
  if (step === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans flex flex-col">
        <header className="flex justify-between items-center p-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Layers className="text-white w-5 h-5"/>
            </div>
            <span className="font-bold text-xl tracking-tight">Sarkar Seva</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <button className="text-blue-600 font-semibold hover:text-blue-700">Home</button>
            <button className="hover:text-slate-900">About</button>
            <button className="hover:text-slate-900">How it Works</button>
          </nav>
          <button onClick={() => setStep(1)} className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg">
            Get Started
          </button>
        </header>

        <main className="flex-1 flex items-center justify-between max-w-7xl mx-auto w-full px-8 pb-20">
          <div className="max-w-xl space-y-6">
            <div className="space-y-2">
              <h1 className="text-6xl font-serif text-slate-900 leading-[1.1]">
                Government services <br />
                <span className="italic text-slate-900">connected.</span>
              </h1>
            </div>
            <p className="text-lg text-slate-600 max-w-md">
              One request. Multiple departments.<br/>One coordinated journey.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <button onClick={() => setStep(1)} className="bg-slate-900 text-white px-6 py-3.5 rounded-full font-medium flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                Start a request <ArrowRight className="w-4 h-4"/>
              </button>
              <button className="flex items-center gap-2 text-slate-500 font-medium hover:text-slate-900 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-slate-300"/> Watch how it works
              </button>
            </div>
            <div className="pt-16 text-slate-400/80 italic font-serif text-xl leading-relaxed">
              Same you.<br/>Better process.<br/>Faster services.
            </div>
          </div>
          
          {/* Animated Graph Diagram */}
          <div className="hidden lg:flex relative w-[500px] h-[500px] items-center justify-center">
            <div className="absolute w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center z-10 shadow-2xl shadow-blue-500/30">
              <Layers className="text-white w-10 h-10"/>
              <span className="absolute -bottom-10 font-bold text-slate-900">Sarkar Seva</span>
            </div>
            <div className="absolute top-10 w-16 h-16 bg-white border border-slate-100 shadow-xl rounded-full flex items-center justify-center -translate-y-12 transition-transform hover:scale-110">
              <User className="text-blue-500 w-6 h-6"/>
              <span className="absolute -top-7 text-sm font-bold text-blue-600">Identity</span>
            </div>
            <div className="absolute left-10 w-16 h-16 bg-white border border-slate-100 shadow-xl rounded-full flex items-center justify-center -translate-x-12 transition-transform hover:scale-110">
              <FileText className="text-yellow-500 w-6 h-6"/>
              <span className="absolute -left-16 text-sm font-bold text-yellow-600">Income</span>
            </div>
            <div className="absolute right-10 w-16 h-16 bg-white border border-slate-100 shadow-xl rounded-full flex items-center justify-center translate-x-12 transition-transform hover:scale-110">
              <Building className="text-green-500 w-6 h-6"/>
              <span className="absolute -right-20 text-sm font-bold text-green-600">Revenue</span>
            </div>
            <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 500 500">
              <circle cx="250" cy="250" r="140" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 6" className="animate-[spin_60s_linear_infinite]" />
              <path d="M 250 250 L 250 80" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M 250 250 L 110 250" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M 250 250 L 390 250" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
          </div>
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------
  // SCREEN 1: SIGN IN (Exact Video Replica)
  // ---------------------------------------------------------
  if (step === 1) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl w-full max-w-5xl flex overflow-hidden shadow-2xl h-[600px]">
          
          <div className="w-1/2 bg-[#B5C2DF] p-12 flex flex-col justify-between relative overflow-hidden">
            <button onClick={() => setStep(0)} className="absolute top-6 left-6 text-[#2F3A56]/60 hover:text-[#2F3A56] text-sm font-bold z-20 transition-colors">← Back</button>
            <div className="z-10 text-[#2F3A56] mt-8">
              <h2 className="text-2xl font-serif italic mb-1">Mumbai</h2>
              <h1 className="text-4xl font-bold">Gateway of India</h1>
            </div>
            {/* Gateway of India CSS Art */}
            <div className="absolute bottom-0 left-0 w-full h-64 bg-[#a0b0d4] z-0 flex items-end justify-center pb-8">
                <div className="w-48 h-48 border-8 border-[#8b9bc2] rounded-t-[100px] border-b-0 flex items-end justify-center relative">
                    <div className="w-32 h-32 border-8 border-[#8b9bc2] rounded-t-[80px] border-b-0"></div>
                    <div className="absolute -left-16 bottom-10 text-white"><svg width="40" height="20" viewBox="0 0 40 20"><path d="M0,10 Q10,0 20,10 T40,10 L30,20 L10,20 Z" fill="white"/></svg></div>
                </div>
            </div>
          </div>
          
          <div className="w-1/2 p-16 flex flex-col justify-center bg-white relative">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <Layers className="text-white w-3 h-3"/>
              </div>
              <span className="font-bold text-sm tracking-tight text-slate-800">Sarkar Seva</span>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back!</h2>
            <p className="text-slate-500 mb-8 text-sm">Log in to continue to Sarkar Seva.</p>

            {/* Role / Auth Type Toggles */}
            <div className="flex bg-slate-50 p-1 rounded-xl mb-6 border border-slate-100">
              <button onClick={() => { setLoginTab("citizen"); setOtpSent(false); generateCaptcha(); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${loginTab === "citizen" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}>
                <User className="w-4 h-4"/> Citizen
              </button>
              <button onClick={() => { setLoginTab("official"); setOtpSent(false); generateCaptcha(); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${loginTab === "official" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}>
                <Building className="w-4 h-4"/> Department
              </button>
            </div>

            {loginTab === "citizen" && !otpSent && (
              <div className="flex border-b border-slate-200 mb-6">
                <button onClick={() => setAuthMode('mobile')} className={`flex-1 pb-3 text-sm font-bold transition-all ${authMode === 'mobile' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Mobile</button>
                <button onClick={() => setAuthMode('email')} className={`flex-1 pb-3 text-sm font-bold transition-all ${authMode === 'email' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Email</button>
                <button onClick={() => setAuthMode('aadhaar')} className={`flex-1 pb-3 text-sm font-bold transition-all ${authMode === 'aadhaar' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Aadhaar</button>
              </div>
            )}

            {authError && <div className="p-3 mb-4 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2 border border-red-200"><AlertTriangle className="w-4 h-4"/>{authError}</div>}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-slate-900 transition-all">
                  {authMode === 'mobile' && loginTab === 'citizen' && (
                    <div className="px-4 py-3.5 bg-slate-100 border-r border-slate-200 text-slate-500 font-medium text-sm flex items-center">+91</div>
                  )}
                  <input 
                    type={authMode === 'email' || loginTab === 'official' ? 'email' : 'text'}
                    required 
                    placeholder={loginTab === 'official' ? 'officer@maharashtra.gov.in' : authMode === 'email' ? 'citizen@example.com' : authMode === 'aadhaar' ? '12-Digit Identity Number' : 'Enter your mobile number'}
                    value={contact} 
                    onChange={e => setContact(e.target.value)} 
                    className="flex-1 px-4 py-3.5 bg-transparent outline-none text-slate-900 text-sm placeholder:text-slate-400" 
                  />
                </div>

                {/* Dynamic Captcha */}
                <div className="flex gap-3">
                  <div className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden group">
                    <span className="font-mono text-lg font-bold text-slate-700 tracking-widest line-through decoration-slate-400/70 italic select-none">{captchaCode}</span>
                    <button type="button" onClick={generateCaptcha} className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><RefreshCw className="w-4 h-4 text-slate-700"/></button>
                  </div>
                  <input type="text" required maxLength={5} placeholder="Enter CAPTCHA" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} className="w-2/3 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all uppercase" />
                </div>

                <button disabled={authLoading} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors mt-2 flex justify-center items-center gap-2 shadow-lg">
                  {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4"/></>}
                </button>

                {loginTab === 'citizen' && (
                  <>
                    <div className="flex items-center gap-4 py-2">
                      <div className="h-px bg-slate-100 flex-1"></div>
                      <span className="text-xs text-slate-400 font-medium">or</span>
                      <div className="h-px bg-slate-100 flex-1"></div>
                    </div>
                    <button type="button" className="w-full bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500"/> Continue with Google
                    </button>
                  </>
                )}
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="text-sm text-slate-600 text-center px-4">
                  We sent a secure code to <span className="font-bold text-slate-900">{contact}</span>
                </div>
                <input type="text" maxLength={6} required placeholder="· · · · · ·" value={otp} onChange={e => setOtp(e.target.value)} className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-3xl tracking-[0.5em] font-mono text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                <button disabled={authLoading} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2">
                  {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Log in"}
                </button>
              </form>
            )}
            
            <p className="text-center text-[11px] text-slate-400 mt-8 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3"/> Secure & trusted. Your data is safe with us.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // MAIN APP SHELL (Sidebar, Header, Main Content)
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex sticky top-0 h-screen shrink-0">
        <div className="p-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Layers className="text-white w-3 h-3"/>
            </div>
            <span className="font-bold tracking-tight text-slate-800">Sarkar Seva</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {userRole === "citizen" && (
            <>
              <button onClick={() => {setCurrentView("services"); setWorkflowStep(0);}} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${currentView === "services" ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
                <Home className="w-4 h-4"/> {t.citizenServices}
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <FileText className="w-4 h-4"/> New Request
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <List className="w-4 h-4"/> My Requests
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <User className="w-4 h-4"/> Profile
              </button>
            </>
          )}
          {userRole === "official" && (
            <button onClick={() => setCurrentView("admin")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${currentView === "admin" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
              <LayoutDashboard className="w-4 h-4"/> {t.deptDashboard}
            </button>
          )}
        </nav>

        <div className="p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <HelpCircle className="w-4 h-4"/> Help
          </button>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2 px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
                {userRole === 'official' ? 'GO' : 'MC'}
              </div>
              <div className="text-sm font-bold text-slate-700">{userRole === 'official' ? 'Govt Officer' : 'Manya'}</div>
            </div>
            <button onClick={() => {setStep(0); setWorkflowStep(0);}} className="text-slate-400 hover:text-slate-700 transition-colors" title="Logout">
              <LogOut className="w-4 h-4"/>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        {workflowStep === 0 && currentView === 'services' && (
          <header className="flex justify-end p-6 shrink-0 absolute top-0 right-0 z-50">
             <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                <Globe className="w-4 h-4 text-slate-500" />
                <select value={globalLang} onChange={(e) => setGlobalLang(e.target.value)} className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                  <option>Kannada</option>
                </select>
             </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto relative">
          
          {/* VIEW: CITIZEN PORTAL (Dashboard) */}
          {currentView === "services" && workflowStep === 0 && (
            <div className="p-12 max-w-5xl animate-in fade-in">
              <div className="flex justify-between items-start mb-12 mt-8">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">Good morning, Manya ☀️</h1>
                  <p className="text-slate-500">Let's get your Government work done, together.</p>
                </div>
                <div className="text-right hidden md:block">
                  <span className="font-serif italic text-blue-600 text-xl block leading-snug">Your request</span>
                  <span className="font-serif italic text-blue-600 text-xl block leading-snug">matters</span>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-12">
                <h2 className="text-sm font-bold text-slate-900 mb-4">What do you need today?</h2>
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => {setSearchQuery(e.target.value); setShowSuggestions(true);}}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 outline-none text-slate-900 focus:ring-2 focus:ring-blue-600 text-lg transition-all pr-16"
                  />
                  <button className="absolute right-2 bg-slate-900 text-white p-3 rounded-lg hover:bg-slate-800 transition-colors">
                    <ArrowRight className="w-5 h-5"/>
                  </button>
                  
                  {showSuggestions && searchQuery && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                      {filteredServices.length > 0 ? filteredServices.map(s => (
                        <button key={s} onClick={() => startWorkflow(s)} className="w-full text-left px-6 py-3.5 hover:bg-slate-50 border-b border-slate-50 font-medium text-slate-700 last:border-0 transition-colors flex items-center gap-3">
                           <Search className="w-4 h-4 text-slate-400"/> {s}
                        </button>
                      )) : (
                        <div className="px-6 py-4 text-slate-500 text-sm">No services found matching your search.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-4">{t.popular}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Home, label: "Housing Scheme", color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: FileText, label: "Income Certificate", color: "text-yellow-600", bg: "bg-yellow-50" },
                  { icon: Building, label: "Property Records", color: "text-green-600", bg: "bg-green-50" },
                  { icon: Layers, label: "Other Services", color: "text-purple-600", bg: "bg-purple-50" },
                ].map((s, idx) => (
                  <button key={idx} onClick={() => startWorkflow(s.label === 'Other Services' ? 'Senior Citizen Registration' : s.label)} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all text-center flex flex-col items-center gap-3 group">
                    <div className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}><s.icon className={`w-6 h-6 ${s.color}`} /></div>
                    <span className="font-semibold text-sm text-slate-700">{s.label}</span>
                  </button>
                ))}
              </div>
              
              {/* FAB for AI Chat */}
              <button onClick={() => setCurrentView("chat")} className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all hover:scale-105 flex items-center gap-2 group z-50">
                <MessageSquare className="w-6 h-6" />
                <span className="font-bold pr-2 overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">Ask AI Mitra</span>
              </button>
            </div>
          )}

          {/* WORKFLOW: 1. Start a Request (Understood) */}
          {currentView === "services" && workflowStep === 1 && (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 fixed inset-0 z-50">
              <div className="bg-white rounded-3xl w-full max-w-4xl min-h-[500px] p-12 shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
                <button onClick={() => setWorkflowStep(0)} className="absolute top-8 left-8 text-slate-400 hover:text-slate-900 text-sm font-bold flex items-center gap-2 transition-colors">← Back</button>
                
                <div className="max-w-2xl mx-auto mt-12 text-center">
                  <h2 className="text-4xl font-serif text-slate-900 mb-12 italic">We understood your request! ✨</h2>
                  
                  <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 mb-12 flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <Home className="w-6 h-6"/>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{activeScheme}</h3>
                      <p className="text-slate-500 text-sm mt-0.5">We'll check information from multiple departments.</p>
                    </div>
                  </div>

                  <div className="text-left">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Systems that will be involved</h4>
                    <div className="flex gap-4 mb-12">
                      {[{icon: User, c: "text-blue-500", l: "Identity"}, {icon: FileText, c: "text-yellow-500", l: "Income"}, {icon: Building, c: "text-green-500", l: "Revenue"}].map((d, i) => (
                        <div key={i} className="flex-1 bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center gap-2 shadow-sm">
                          <d.icon className={`w-5 h-5 ${d.c}`}/>
                          <span className="text-sm font-bold text-slate-700">{d.l} Dept</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button onClick={() => setWorkflowStep(2)} className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2">
                      Continue <ArrowRight className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WORKFLOW: 2. Request Review */}
          {currentView === "services" && workflowStep === 2 && (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 fixed inset-0 z-50">
              <div className="bg-white rounded-3xl w-full max-w-4xl p-12 shadow-2xl relative animate-in slide-in-from-right-8 duration-300">
                <button onClick={() => setWorkflowStep(1)} className="absolute top-8 left-8 text-slate-400 hover:text-slate-900 text-sm font-bold flex items-center gap-2 transition-colors">← Back</button>
                
                <div className="max-w-3xl mx-auto mt-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Review your request</h2>
                  <p className="text-slate-500 text-sm mb-8">Please check the details before we proceed.</p>

                  <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shrink-0">
                      <Home className="w-5 h-5"/>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{activeScheme}</h3>
                      <p className="text-slate-400 text-xs mt-0.5 font-mono">Request ID: PENDING</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Information Required</h4>
                      <div className="space-y-4">
                         <div className="flex items-start gap-3">
                           <User className="w-4 h-4 text-slate-400 mt-0.5"/>
                           <div><div className="font-bold text-sm text-slate-800">Identity</div><div className="text-xs text-slate-500">Name, Verified profile</div></div>
                         </div>
                         <div className="flex items-start gap-3">
                           <FileText className="w-4 h-4 text-slate-400 mt-0.5"/>
                           <div><div className="font-bold text-sm text-slate-800">Income</div><div className="text-xs text-slate-500">Annual income details</div></div>
                         </div>
                         <div className="flex items-start gap-3">
                           <Building className="w-4 h-4 text-slate-400 mt-0.5"/>
                           <div><div className="font-bold text-sm text-slate-800">Property</div><div className="text-xs text-slate-500">Existing property records</div></div>
                         </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Purpose</h4>
                      <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        Determining scheme eligibility based on your verified information directly from government systems.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-6">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex gap-4">
                      <span>3 Departments</span>
                      <span>•</span>
                      <span>2 Data Points</span>
                      <span>•</span>
                      <span>1 Request</span>
                    </div>
                    <button onClick={() => setWorkflowStep(3)} className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2">
                      Continue <ArrowRight className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WORKFLOW: 3. Consent / Authorization */}
          {currentView === "services" && workflowStep === 3 && (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 fixed inset-0 z-50">
              <div className="bg-white rounded-3xl w-full max-w-4xl p-12 shadow-2xl animate-in slide-in-from-right-8 duration-300 flex overflow-hidden">
                
                <div className="w-1/2 pr-8 border-r border-slate-100 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">You're in control</h2>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                    Sarkar Seva asks permission for each department and each detail it will access — data is used only for this request and access can be revoked anytime.
                  </p>
                  
                  <div className="space-y-3 mb-10">
                    {[
                      { name: "Identity Department", details: "Name, Verified Profile", icon: User, color: "text-blue-500" },
                      { name: "Income Department", details: "Generic Income, Tax Details", icon: FileText, color: "text-yellow-500" },
                      { name: "Property Department", details: "Generic Property records", icon: Building, color: "text-green-500" }
                    ].map((dept, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 ${dept.color}`}><dept.icon className="w-4 h-4" /></div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{dept.name}</h4>
                            <p className="text-[11px] text-slate-500">{dept.details}</p>
                          </div>
                        </div>
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm"><Check className="w-3 h-3 text-white"/></div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <button onClick={startOrchestration} className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 shadow-lg transition-colors">
                      Allow access
                    </button>
                    <button onClick={() => setWorkflowStep(2)} className="px-6 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="w-1/2 pl-12 flex flex-col items-center justify-center text-center">
                   <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center border border-blue-100 mb-6 shadow-inner relative">
                      <Shield className="w-10 h-10 text-blue-600"/>
                      <div className="absolute -right-2 -top-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"><Check className="w-3 h-3 text-white"/></div>
                   </div>
                   <h3 className="font-serif italic text-2xl text-slate-800 mb-2">Your data.<br/>Your control.<br/>Our responsibility.</h3>
                </div>
              </div>
            </div>
          )}

          {/* WORKFLOW: 4. Live Orchestration (Dark Mode) */}
          {currentView === "services" && workflowStep === 4 && (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white fixed inset-0 z-50">
              <div className="w-full max-w-4xl relative">
                <div className="flex justify-between items-center border-b border-slate-800 pb-6 mb-10">
                  <div>
                    <div className="text-slate-400 text-xs mb-1.5 uppercase font-bold tracking-widest">Request ID: {txId}</div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      Agent Orchestration 
                      <span className="text-blue-400 text-xs font-bold uppercase tracking-wider bg-blue-900/40 border border-blue-800 px-3 py-1 rounded-full animate-pulse">(Live)</span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium bg-slate-800 border border-slate-700 px-4 py-2 rounded-full text-slate-300">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400"/> Processing...
                  </div>
                </div>

                <div className="flex">
                  <div className="w-1/2 space-y-8 relative">
                    <div className="absolute left-[11px] top-4 bottom-4 w-px bg-slate-800 -z-10"></div>
                    {["Request Agent", "Routing Agent", "Data Agents", "Validation Agent", "Consent & Security Agent", "Response Agent"].map((agent, index) => {
                      const isActive = orchestrationProgress === index;
                      const isPast = orchestrationProgress > index;
                      const subtexts = [
                        "Understanding your request", "Identifying required departments", "", 
                        "Checking data consistency", "Ensuring secure data exchange", "Preparing final response"
                      ];
                      
                      return (
                        <div key={index} className={`flex gap-5 ${isActive ? 'opacity-100' : isPast ? 'opacity-50' : 'opacity-20'} transition-opacity duration-500`}>
                          <div className="mt-0.5 shrink-0">
                            {isPast ? (
                              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.4)]"><Check className="w-3 h-3 text-white"/></div>
                            ) : isActive ? (
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.6)]"><div className="w-2 h-2 bg-white rounded-full"></div></div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-slate-700 bg-slate-900"></div>
                            )}
                          </div>
                          <div>
                            <h4 className={`font-bold text-lg ${isActive ? 'text-white' : 'text-slate-300'}`}>{index + 1}. {agent}</h4>
                            {subtexts[index] && <p className="text-sm text-slate-500 mt-1">{subtexts[index]}</p>}
                            
                            {index === 2 && (isActive || isPast) && (
                              <div className="flex gap-3 mt-4">
                                <div className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${isPast ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-blue-500/30 bg-blue-500/10 text-blue-400'}`}>
                                  <User className="w-3 h-3"/> Identity {isPast ? 'Verified' : 'Verifying'}
                                </div>
                                <div className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${isPast ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'}`}>
                                  <FileText className="w-3 h-3"/> Income {isPast ? 'Verified' : 'Verifying'}
                                </div>
                                <div className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${isPast ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-slate-700 bg-slate-800 text-slate-400'}`}>
                                  <Building className="w-3 h-3"/> Property {isPast ? 'Verified' : 'Pending'}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="w-1/2 flex items-center justify-center opacity-80">
                    <div className="font-serif italic text-4xl text-center leading-relaxed text-slate-300 relative">
                       <span className="absolute -top-8 -left-8 text-blue-500/20 text-6xl">"</span>
                       Multiple agents.<br/>One goal.
                       <span className="absolute -bottom-8 -right-8 text-blue-500/20 text-6xl">"</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WORKFLOW: 5. Final Result */}
          {currentView === "services" && workflowStep === 5 && (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 fixed inset-0 z-50">
              <div className="bg-white rounded-3xl w-full max-w-4xl p-16 shadow-2xl relative text-center animate-in zoom-in-95 duration-500">
                <div className="absolute top-12 left-12 font-serif italic text-2xl text-blue-900 opacity-20 text-left leading-tight">All systems <br/>in sync!</div>
                
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-100 shadow-inner">
                  <Home className="w-10 h-10 text-blue-600"/>
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{activeScheme}</h2>
                <div className="bg-emerald-50 text-emerald-700 px-8 py-2.5 rounded-full font-black tracking-widest uppercase text-xl mb-6 border border-emerald-200 inline-block shadow-sm">
                  ELIGIBLE
                </div>
                <p className="text-sm text-slate-500 mb-12">Based on verified information from 3 government systems.</p>

                <div className="flex justify-center gap-6 w-full max-w-2xl mx-auto mb-12">
                  {[
                    { icon: User, color: "text-blue-500 bg-blue-50 border-blue-100", label: "Identity" },
                    { icon: FileText, color: "text-yellow-600 bg-yellow-50 border-yellow-100", label: "Income" },
                    { icon: Building, color: "text-green-600 bg-green-50 border-green-100", label: "Property" }
                  ].map((d, i) => (
                    <div key={i} className="flex-1 bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border mb-3 ${d.color}`}>
                        <d.icon className="w-5 h-5"/>
                      </div>
                      <span className="text-xs font-bold text-slate-700 mb-1">{d.label}</span>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Verified</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center w-full max-w-md mx-auto border-t border-slate-100 pt-8 mb-10">
                   <div className="text-left">
                     <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Request ID</div>
                     <div className="text-sm font-mono font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded inline-block border border-slate-200">{txId}</div>
                   </div>
                   <div className="text-right">
                     <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Completed at</div>
                     <div className="text-sm font-mono font-bold text-slate-900">09:43 AM • Today</div>
                   </div>
                </div>

                <button onClick={() => {setWorkflowStep(0); setSearchQuery("");}} className="bg-slate-900 text-white px-10 py-4.5 rounded-xl font-bold hover:bg-slate-800 shadow-xl mx-auto flex items-center gap-2 transition-transform hover:scale-105">
                  Continue to application <ArrowRight className="w-5 h-5"/>
                </button>
              </div>
            </div>
          )}

          {/* VIEW: DEPARTMENT DASHBOARD (Admin) */}
          {currentView === "admin" && (
            <div className="p-8 max-w-6xl mx-auto animate-in fade-in pt-12">
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.deptDashboard}</h1>
                  <p className="text-sm text-slate-500 mt-1">Live Swarm Activity & Anomaly Detection</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400"/>
                  <select className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer">
                    <option>All Services (Statewide)</option>
                    <option>Housing Scheme Eligibility</option>
                    <option>Income Certificate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Verified</div>
                  <div className="text-4xl font-black text-slate-900">12,408</div>
                </div>
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-emerald-100/50 -skew-x-12 transform translate-x-4"></div>
                  <div className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Cleared by AI</div>
                  <div className="text-4xl font-black text-emerald-800 relative z-10">92%</div>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden">
                   <div className="absolute right-0 top-0 bottom-0 w-16 bg-red-100/50 -skew-x-12 transform translate-x-4"></div>
                  <div className="text-red-700 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Anomalies Caught</div>
                  <div className="text-4xl font-black text-red-800 relative z-10">142</div>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-blue-100/50 -skew-x-12 transform translate-x-4"></div>
                  <div className="text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Swarm Processing</div>
                  <div className="text-4xl font-black text-blue-800 relative z-10">48</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h2 className="font-bold text-slate-800 flex items-center gap-2"><Database className="w-5 h-5 text-blue-600"/> Live Transaction Queue</h2>
                  <button className="text-sm font-bold text-blue-600 hover:text-blue-800">View All →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                      <tr>
                        <th className="px-6 py-4">TXN ID</th>
                        <th className="px-6 py-4">Applicant</th>
                        <th className="px-6 py-4">Service Required</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { id: "GV-92812", name: "Ramesh Kumar", service: "Housing Scheme", status: "Cleared", sc: "text-emerald-700 bg-emerald-50 border border-emerald-100" },
                        { id: "GV-44129", name: "John Doe", service: "Income Certificate", status: "Anomaly", sc: "text-red-700 bg-red-50 border border-red-200" },
                        { id: "GV-11023", name: "Priya Sharma", service: "PAN Services", status: "Pending AI", sc: "text-blue-700 bg-blue-50 border border-blue-100" },
                        { id: "GV-55821", name: "Anita Desai", service: "Housing Scheme", status: "Cleared", sc: "text-emerald-700 bg-emerald-50 border border-emerald-100" },
                      ].map((req, i) => (
                        <tr key={i} className={`hover:bg-slate-50 transition-colors ${req.status === 'Anomaly' ? 'bg-red-50/10' : ''}`}>
                          <td className="px-6 py-4 font-mono font-bold text-slate-600">{req.id}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">{req.name}</td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{req.service}</td>
                          <td className="px-6 py-4"><span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${req.sc}`}>{req.status}</span></td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-blue-600 font-bold text-xs hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors">Review</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: AI MITRA CHAT */}
          {currentView === "chat" && (
            <div className="p-8 max-w-4xl mx-auto h-[calc(100vh-64px)] flex flex-col animate-in fade-in">
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col flex-1 overflow-hidden">
                
                <div className="bg-[#002147] p-6 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white tracking-wide text-lg">{t.aiMitra}</h2>
                      <p className="text-[10px] text-blue-200 uppercase tracking-widest font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full relative"><span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-50"></span></span> 
                        Active Support Agent
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setCurrentView("services")} className="text-slate-400 hover:text-white transition-colors bg-white/10 p-2 rounded-xl">
                    <LogOut className="w-4 h-4"/>
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50 space-y-6">
                  <div className="text-center text-xs text-slate-400 font-medium mb-6 uppercase tracking-wider">Today</div>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                        msg.role === "user" ? "bg-slate-900 text-white rounded-br-sm" : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start animate-in fade-in">
                      <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-sm shadow-sm flex gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                
                <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                  <form onSubmit={handleSendMessage} className="flex gap-2 items-center bg-slate-50 border border-slate-200 rounded-2xl p-1.5 pr-2 focus-within:ring-2 focus-within:ring-slate-900 focus-within:bg-white transition-all shadow-sm">
                    
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-400 hover:text-slate-900 rounded-xl transition-colors bg-white border border-slate-100 shadow-sm" title="Upload Document">
                      <Paperclip className="w-5 h-5" />
                    </button>

                    <input 
                      type="text" 
                      value={chatInput} 
                      onChange={e => setChatInput(e.target.value)} 
                      placeholder={isRecording ? "Listening..." : "Message Sarkar Mitra..."} 
                      className={`flex-1 bg-transparent px-3 py-3 outline-none text-sm text-slate-900 ${isRecording ? "text-red-500 font-bold" : ""}`}
                      disabled={chatLoading}
                    />

                    <button type="button" onClick={simulateVoice} className={`p-3 rounded-xl transition-all shadow-sm border ${isRecording ? "bg-red-100 text-red-600 border-red-200 animate-pulse" : "bg-white text-slate-400 hover:text-slate-900 border-slate-100"}`} title="Voice Input">
                      <Mic className="w-5 h-5" />
                    </button>

                    <button type="submit" disabled={!chatInput.trim() || chatLoading} className="bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-xl transition-all disabled:opacity-50 shadow-md">
                      <Send className="w-4 h-4" />
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