"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Building, User, FileText, CheckCircle2, Search, Shield, 
  Activity, Layers, ArrowRight, Home, List, HelpCircle, 
  Check, Loader2, Landmark, Globe, Users, Lock, ChevronRight, 
  UserCircle, Network, RefreshCw, AlertTriangle, Paperclip, 
  Mic, Send, Bot, X, FileDigit
} from "lucide-react";

// --- TRANSLATION DICTIONARY ---
const TRANSLATIONS: any = {
  English: {
    brandName: "Sarkar Seva",
    govLabel: "Government of Maharashtra | Govt. of India",
    home: "Home", about: "About", works: "How it Works", getStarted: "Get Started",
    heroTitle: "Government services", heroHighlight: "connected.",
    heroSub: "One request. Multiple departments. One coordinated journey.",
    startReq: "Start a request", watchHow: "Watch how it works",
    mumbai: "Mumbai", gateway: "Gateway of India",
    welcome: "Welcome back!", loginSub: "Log in to continue to Sarkar Seva.",
    citizen: "Citizen", official: "Dept Official",
    mobile: "Mobile", email: "Email", aadhaar: "Aadhaar",
    captcha: "Security Verification", refresh: "Refresh",
    sendOtp: "Continue", enterOtp: "Enter 6-Digit OTP", verify: "Verify & Authenticate",
    goodMorning: "Good morning", reqMatters: "Your request matters",
    whatNeed: "What do you need today?", searchPlace: "e.g. Check my housing scheme eligibility...",
    popServices: "Popular Services",
    deptDash: "Department Oversight", totalReq: "Total Requests", cleared: "Cleared by AI",
    aiAssistant: "Sarkar Mitra AI", askAi: "Ask me anything...",
    allSync: "All systems in sync!", eligible: "Eligible"
  },
  Hindi: {
    brandName: "सरकार सेवा",
    govLabel: "महाराष्ट्र शासन | भारत सरकार",
    home: "होम", about: "बारे में", works: "यह कैसे काम करता है", getStarted: "शुरू करें",
    heroTitle: "सरकारी सेवाएं", heroHighlight: "अब एक साथ।",
    heroSub: "एक अनुरोध। कई विभाग। एक समन्वित यात्रा।",
    startReq: "अनुरोध शुरू करें", watchHow: "देखें यह कैसे काम करता है",
    mumbai: "मुंबई", gateway: "गेटवे ऑफ इंडिया",
    welcome: "वापसी पर स्वागत है!", loginSub: "सरकार सेवा में जारी रखने के लिए लॉग इन करें।",
    citizen: "नागरिक", official: "विभागीय अधिकारी",
    mobile: "मोबाइल", email: "ईमेल", aadhaar: "आधार",
    captcha: "सुरक्षा सत्यापन", refresh: "रिफ्रेश",
    sendOtp: "आगे बढ़ें", enterOtp: "6-अंकीय OTP दर्ज करें", verify: "सत्यापित करें",
    goodMorning: "सुप्रभात", reqMatters: "आपका अनुरोध महत्वपूर्ण है",
    whatNeed: "आज आपको क्या चाहिए?", searchPlace: "उदा. मेरी आवास योजना पात्रता जांचें...",
    popServices: "लोकप्रिय सेवाएं",
    deptDash: "विभाग अवलोकन", totalReq: "कुल अनुरोध", cleared: "AI द्वारा साफ़ किया गया",
    aiAssistant: "सरकार मित्र AI", askAi: "मुझसे कुछ भी पूछें...",
    allSync: "सभी सिस्टम सिंक में हैं!", eligible: "पात्र"
  },
  Marathi: {
    brandName: "सरकार सेवा",
    govLabel: "महाराष्ट्र शासन | भारत सरकार",
    home: "मुख्यपृष्ठ", about: "आमच्याबद्दल", works: "हे कसे कार्य करते", getStarted: "सुरू करा",
    heroTitle: "सरकारी सेवा", heroHighlight: "आता जोडलेल्या.",
    heroSub: "एक विनंती. अनेक विभाग. एक समन्वित प्रवास.",
    startReq: "विनंती सुरू करा", watchHow: "हे कसे कार्य करते ते पहा",
    mumbai: "मुंबई", gateway: "गेटवे ऑफ इंडिया",
    welcome: "स्वागत आहे!", loginSub: "सरकार सेवा सुरू ठेवण्यासाठी लॉग इन करा.",
    citizen: "नागरिक", official: "विभागीय अधिकारी",
    mobile: "मोबाईल", email: "ईमेल", aadhaar: "आधार",
    captcha: "सुरक्षा पडताळणी", refresh: "रिफ्रेश करा",
    sendOtp: "पुढे जा", enterOtp: "6-अंकी OTP प्रविष्ट करा", verify: "पडताळणी करा",
    goodMorning: "शुभ प्रभात", reqMatters: "तुमची विनंती महत्त्वाची आहे",
    whatNeed: "तुम्हाला आज काय हवे आहे?", searchPlace: "उदा. माझी गृहनिर्माण योजना पात्रता तपासा...",
    popServices: "लोकप्रिय सेवा",
    deptDash: "विभाग देखरेख", totalReq: "एकूण विनंत्या", cleared: "AI द्वारे मंजूर",
    aiAssistant: "सरकार मित्र AI", askAi: "मला काहीही विचारा...",
    allSync: "सर्व सिस्टम सिंकमध्ये!", eligible: "पात्र"
  },
  Kannada: {
    brandName: "ಸರ್ಕಾರ್ ಸೇವಾ",
    govLabel: "ಮಹಾರಾಷ್ಟ್ರ ಸರ್ಕಾರ | ಭಾರತ ಸರ್ಕಾರ",
    home: "ಮುಖಪುಟ", about: "ಬಗ್ಗೆ", works: "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ", getStarted: "ಪ್ರಾರಂಭಿಸಿ",
    heroTitle: "ಸರ್ಕಾರಿ ಸೇವೆಗಳು", heroHighlight: "ಸಂಪರ್ಕಗೊಂಡಿವೆ.",
    heroSub: "ಒಂದು ವಿನಂತಿ. ಅನೇಕ ಇಲಾಖೆಗಳು. ಒಂದು ಸಂಘಟಿತ ಪ್ರಯಾಣ.",
    startReq: "ವಿನಂತಿಯನ್ನು ಪ್ರಾರಂಭಿಸಿ", watchHow: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ ನೋಡಿ",
    mumbai: "ಮುಂಬೈ", gateway: "ಗೇಟ್ವೇ ಆಫ್ ಇಂಡಿಯಾ",
    welcome: "ಸ್ವಾಗತ!", loginSub: "ಸರ್ಕಾರ್ ಸೇವಾ ಮುಂದುವರಿಸಲು ಲಾಗ್ ಇನ್ ಮಾಡಿ.",
    citizen: "ನಾಗರಿಕ", official: "ಇಲಾಖಾ ಅಧಿಕಾರಿ",
    mobile: "ಮೊಬೈಲ್", email: "ಇಮೇಲ್", aadhaar: "ಆಧಾರ್",
    captcha: "ಭದ್ರತಾ ಪರಿಶೀಲನೆ", refresh: "ರಿಫ್ರೆಶ್",
    sendOtp: "ಮುಂದುವರಿಯಿರಿ", enterOtp: "6-ಅಂಕಿಯ OTP ನಮೂದಿಸಿ", verify: "ಪರಿಶೀಲಿಸಿ",
    goodMorning: "ಶುಭೋದಯ", reqMatters: "ನಿಮ್ಮ ವಿನಂತಿ ಮುಖ್ಯವಾಗಿದೆ",
    whatNeed: "ಇಂದು ನಿಮಗೆ ಏನು ಬೇಕು?", searchPlace: "ಉದಾ. ನನ್ನ ವಸತಿ ಯೋಜನೆ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ...",
    popServices: "ಜನಪ್ರಿಯ ಸೇವೆಗಳು",
    deptDash: "ಇಲಾಖೆಯ ಮೇಲ್ವಿಚಾರಣೆ", totalReq: "ಒಟ್ಟು ವಿನಂತಿಗಳು", cleared: "AI ನಿಂದ ತೆರವುಗೊಳಿಸಲಾಗಿದೆ",
    aiAssistant: "ಸರ್ಕಾರ್ ಮಿತ್ರ AI", askAi: "ನನ್ನನ್ನು ಏನು ಬೇಕಾದರೂ ಕೇಳಿ...",
    allSync: "ಎಲ್ಲಾ ಸಿಸ್ಟಮ್‌ಗಳು ಸಿಂಕ್‌ನಲ್ಲಿವೆ!", eligible: "ಅರ್ಹರು"
  }
};

const REAL_SERVICES = [
  "Housing Scheme Eligibility",
  "Income Certificate Issuance",
  "Property Records Registration",
  "Senior Citizen Registration",
  "Online Marriage Registration",
  "Ayushman Bharat Card",
  "PAN Card Services",
];

export default function SarkarSevaApp() {
  // Global State
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState("English");
  const t = TRANSLATIONS[lang];

  // Auth State
  const [loginRole, setLoginRole] = useState<"citizen" | "official">("citizen");
  const [authMethod, setAuthMethod] = useState<"mobile" | "email" | "aadhaar">("mobile");
  const [contact, setContact] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  
  // Captcha State
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  // Dashboard & Workflow State
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [orchestrationProgress, setOrchestrationProgress] = useState(0);
  const [txId, setTxId] = useState("");
  const [serviceContext, setServiceContext] = useState("Housing Scheme Eligibility");

  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([{ role: "agent", text: "Namaste! I am Sarkar Mitra. How can I assist you today?" }]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Captcha
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptchaCode(code);
    setCaptchaInput("");
  };

  useEffect(() => { generateCaptcha(); }, []);

  // Auto-scroll chat
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isChatOpen]);

  // Orchestration Timer
  useEffect(() => {
    if (step === 5) {
      const interval = setInterval(() => {
        setOrchestrationProgress((prev) => {
          if (prev >= 6) {
            clearInterval(interval);
            setTxId(`GV-${Math.floor(10000 + Math.random() * 90000)}`);
            setTimeout(() => setStep(6), 1000);
            return 6;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Handlers
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (captchaInput.toUpperCase() !== captchaCode) {
      setAuthError("Incorrect CAPTCHA. Please try again.");
      generateCaptcha();
      return;
    }
    setAuthLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setAuthLoading(false);
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setStep(loginRole === "citizen" ? 2 : 10); // 2 = Citizen Dash, 10 = Dept Dash
    }, 1200);
  };

  const handleServiceSelect = (service: string) => {
    setServiceContext(service);
    setSearchQuery("");
    setShowSuggestions(false);
    setStep(3); // Go to Request Review
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: chatInput }]);
    setChatInput("");
    setChatLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "agent", text: `I have received your query regarding government services. Please select a service from the dashboard to proceed securely.` }]);
      setChatLoading(false);
    }, 1500);
  };

  // --- COMPONENT: LANGUAGE SELECTOR ---
  const LangSelector = () => (
    <div className="flex items-center gap-2 bg-slate-100/50 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 transition-colors">
      <Globe className="w-4 h-4 text-blue-600" />
      <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer">
        <option>English</option><option>Hindi</option><option>Marathi</option><option>Kannada</option>
      </select>
    </div>
  );

  // --- COMPONENT: AI CHAT WIDGET ---
  const ChatWidget = () => (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isChatOpen && (
        <div className="bg-white w-[350px] h-[500px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-10">
          <div className="bg-[#0A1128] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border border-blue-400/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{t.aiAssistant}</h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Online</span>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-300 hover:text-white"><X className="w-5 h-5"/></button>
          </div>
          <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${m.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-700 rounded-bl-none"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 bg-white border-t border-slate-200">
            <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
              <button type="button" className="text-slate-400 hover:text-blue-600"><Paperclip className="w-5 h-5"/></button>
              <input type="text" value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder={t.askAi} className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-600" />
              <button type="button" className="text-slate-400 hover:text-blue-600"><Mic className="w-5 h-5"/></button>
              <button type="submit" disabled={!chatInput.trim()} className="bg-[#0A1128] text-white p-2 rounded-full disabled:opacity-50"><Send className="w-4 h-4"/></button>
            </form>
          </div>
        </div>
      )}
      {!isChatOpen && step > 1 && (
        <button onClick={() => setIsChatOpen(true)} className="bg-[#0A1128] hover:bg-blue-900 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 border-2 border-blue-500/20">
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );

  // --- SCREEN 0: LANDING PAGE ---
  if (step === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans flex flex-col relative">
        <div className="w-full bg-[#FF9933] h-1" />
        <header className="flex justify-between items-center p-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Layers className="text-white w-5 h-5"/>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight block leading-none">{t.brandName}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{t.govLabel}</span>
            </div>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600 items-center">
            <a href="#" className="text-blue-600">{t.home}</a>
            <a href="#">{t.about}</a>
            <a href="#">{t.works}</a>
            <LangSelector />
          </nav>
          <button onClick={() => setStep(1)} className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">
            {t.getStarted}
          </button>
        </header>

        <main className="flex-1 flex items-center justify-between max-w-7xl mx-auto w-full px-8">
          <div className="max-w-xl space-y-6 z-10">
            <h1 className="text-6xl font-serif text-slate-900 leading-tight">
              {t.heroTitle} <br />
              <span className="italic text-blue-600 font-semibold">{t.heroHighlight}</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-md">
              {t.heroSub}
            </p>
            <div className="flex items-center gap-4 pt-4">
              <button onClick={() => setStep(1)} className="bg-slate-900 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg">
                {t.startReq} <ArrowRight className="w-4 h-4"/>
              </button>
              <button className="flex items-center gap-2 text-slate-600 font-medium hover:text-slate-900">
                <CheckCircle2 className="w-5 h-5 text-slate-400"/> {t.watchHow}
              </button>
            </div>
          </div>
          
          <div className="hidden lg:flex relative w-[500px] h-[500px] items-center justify-center">
            <div className="absolute w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center z-10 shadow-2xl shadow-blue-500/30">
              <Layers className="text-white w-10 h-10"/>
              <span className="absolute -bottom-8 font-bold text-slate-900">{t.brandName}</span>
            </div>
            <div className="absolute top-10 w-16 h-16 bg-white border border-blue-100 shadow-xl rounded-full flex items-center justify-center -translate-y-12 animate-[bounce_3s_infinite]">
              <User className="text-blue-500 w-6 h-6"/>
              <span className="absolute -top-6 text-sm font-bold text-blue-600">Identity</span>
            </div>
            <div className="absolute left-10 w-16 h-16 bg-white border border-yellow-100 shadow-xl rounded-full flex items-center justify-center -translate-x-12 animate-[bounce_3.5s_infinite]">
              <FileText className="text-yellow-500 w-6 h-6"/>
              <span className="absolute -left-16 text-sm font-bold text-yellow-600">Income</span>
            </div>
            <div className="absolute right-10 w-16 h-16 bg-white border border-green-100 shadow-xl rounded-full flex items-center justify-center translate-x-12 animate-[bounce_4s_infinite]">
              <Building className="text-green-500 w-6 h-6"/>
              <span className="absolute -right-16 text-sm font-bold text-green-600">Revenue</span>
            </div>
            <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 500 500">
              <circle cx="250" cy="250" r="140" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 6" className="animate-[spin_20s_linear_infinite] origin-center" />
            </svg>
          </div>
        </main>
      </div>
    );
  }

  // --- SCREEN 1: SIGN IN ---
  if (step === 1) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-8 right-8"><LangSelector /></div>
        <div className="bg-white rounded-3xl w-full max-w-5xl flex overflow-hidden shadow-2xl h-[650px]">
          {/* Left Illustration */}
          <div className="w-1/2 bg-[#B5C2DF] p-12 flex flex-col justify-between relative overflow-hidden hidden md:flex">
            <div className="z-10 text-[#2F3A56]">
              <h2 className="text-2xl font-serif italic mb-1">{t.mumbai}</h2>
              <h1 className="text-4xl font-bold">{t.gateway}</h1>
              <p className="mt-4 font-semibold text-sm opacity-80">{t.govLabel}</p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-64 bg-[#a0b0d4] z-0 flex items-end justify-center pb-8">
                <div className="w-48 h-48 border-8 border-[#8b9bc2] rounded-t-[100px] border-b-0 flex items-end justify-center">
                    <div className="w-32 h-32 border-8 border-[#8b9bc2] rounded-t-[80px] border-b-0"></div>
                </div>
            </div>
          </div>
          
          {/* Right Form */}
          <div className="w-full md:w-1/2 p-12 md:p-16 flex flex-col justify-center bg-white">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Layers className="text-white w-3 h-3"/>
                </div>
                <span className="font-bold text-sm tracking-tight text-slate-800">{t.brandName}</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2">{t.welcome}</h2>
            <p className="text-slate-500 mb-8 text-sm">{t.loginSub}</p>

            {/* Role Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
              <button onClick={() => { setLoginRole("citizen"); setOtpSent(false); generateCaptcha(); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${loginRole === "citizen" ? "bg-white text-blue-800 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}>
                <Users className="w-4 h-4"/> {t.citizen}
              </button>
              <button onClick={() => { setLoginRole("official"); setOtpSent(false); generateCaptcha(); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${loginRole === "official" ? "bg-white text-emerald-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}>
                <Building className="w-4 h-4"/> {t.official}
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                <AlertTriangle className="w-4 h-4 shrink-0"/> {authError}
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-5">
                {/* Auth Method Tabs */}
                {loginRole === "citizen" && (
                  <div className="flex border-b border-slate-200 mb-4">
                    <button type="button" onClick={() => setAuthMethod("mobile")} className={`flex-1 pb-3 text-sm font-bold transition-all ${authMethod === "mobile" ? "text-slate-900 border-b-2 border-slate-900" : "text-slate-400 hover:text-slate-600"}`}>{t.mobile}</button>
                    <button type="button" onClick={() => setAuthMethod("email")} className={`flex-1 pb-3 text-sm font-bold transition-all ${authMethod === "email" ? "text-slate-900 border-b-2 border-slate-900" : "text-slate-400 hover:text-slate-600"}`}>{t.email}</button>
                    <button type="button" onClick={() => setAuthMethod("aadhaar")} className={`flex-1 pb-3 text-sm font-bold transition-all ${authMethod === "aadhaar" ? "text-slate-900 border-b-2 border-slate-900" : "text-slate-400 hover:text-slate-600"}`}>{t.aadhaar}</button>
                  </div>
                )}

                {/* Input Field based on method */}
                <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 transition-all">
                  <div className="px-4 py-3.5 bg-slate-100 border-r border-slate-200 text-slate-600 font-medium text-sm flex items-center">
                    {loginRole === "official" ? <UserCircle className="w-4 h-4"/> : authMethod === "mobile" ? "+91" : authMethod === "email" ? "@" : <FileDigit className="w-4 h-4"/>}
                  </div>
                  <input 
                    type={authMethod === "email" || loginRole === "official" ? "email" : "text"} 
                    required
                    placeholder={
                      loginRole === "official" ? "official@maharashtra.gov.in" :
                      authMethod === "mobile" ? "Enter your mobile number" :
                      authMethod === "email" ? "Enter your email address" :
                      "Enter Virtual ID or [Aadhaar Redacted]"
                    }
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    className="flex-1 px-4 py-3.5 bg-transparent outline-none text-slate-900 text-sm placeholder:text-slate-400"
                  />
                </div>

                {/* Captcha */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{t.captcha}</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center font-mono text-xl font-bold tracking-[0.3em] text-slate-700 relative overflow-hidden select-none">
                      <span className="line-through decoration-slate-400 decoration-2 italic">{captchaCode}</span>
                    </div>
                    <button type="button" onClick={generateCaptcha} className="p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors" title={t.refresh}>
                      <RefreshCw className="w-5 h-5"/>
                    </button>
                  </div>
                  <input type="text" required maxLength={5} placeholder="Enter 5 characters" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-mono uppercase tracking-widest text-sm" />
                </div>
                
                <button disabled={authLoading} className={`w-full text-white py-4 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 ${loginRole === 'official' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-slate-900 hover:bg-slate-800'}`}>
                  {authLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <>{t.sendOtp} <ArrowRight className="w-4 h-4"/></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-right-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 text-center">
                  Secure OTP sent to <strong className="break-all">{contact}</strong>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.enterOtp}</label>
                  <input type="text" maxLength={6} required placeholder="· · · · · ·" value={otp} onChange={e => setOtp(e.target.value)} className="w-full px-4 py-4 border border-slate-200 rounded-xl text-center text-2xl tracking-[0.5em] font-mono text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <button disabled={authLoading} className={`w-full text-white py-4 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 ${loginRole === 'official' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-slate-900 hover:bg-slate-800'}`}>
                  {authLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : t.verify}
                </button>
              </form>
            )}

            <p className="text-center text-xs text-slate-400 mt-8 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3"/> Secure & trusted. Your data is safe with us.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- SCREEN 2: CITIZEN DASHBOARD ---
  if (step === 2) {
    const filteredServices = REAL_SERVICES.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <div className="min-h-screen bg-slate-50 flex relative">
        <ChatWidget />
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col h-screen sticky top-0 hidden md:flex">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Layers className="text-white w-3 h-3"/>
            </div>
            <span className="font-bold tracking-tight text-slate-800">{t.brandName}</span>
          </div>
          <nav className="flex-1 space-y-2">
            <button className="w-full flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl font-semibold text-sm">
              <Home className="w-5 h-5"/> {t.home}
            </button>
            <button className="w-full flex items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium text-sm transition-colors">
              <List className="w-5 h-5"/> My Requests
            </button>
            <button className="w-full flex items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium text-sm transition-colors">
              <User className="w-5 h-5"/> Profile
            </button>
          </nav>
          <div className="space-y-2 mt-auto border-t border-slate-100 pt-4">
            <button className="w-full flex items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium text-sm transition-colors">
              <HelpCircle className="w-5 h-5"/> Help
            </button>
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">U</div>
                <div className="text-sm font-semibold text-slate-700">User</div>
              </div>
              <button onClick={() => setStep(0)} className="text-slate-400 hover:text-red-500"><LogOut className="w-4 h-4"/></button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8 md:p-12 max-w-5xl">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.goodMorning} ☀️</h1>
              <p className="text-slate-500">Let's get your Government work done, together.</p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="font-serif italic text-blue-600 text-xl block">{t.reqMatters}</span>
              <LangSelector />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-12 relative z-20">
            <h2 className="text-sm font-bold text-slate-900 mb-4">{t.whatNeed}</h2>
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setShowSuggestions(true);}}
                onFocus={() => setShowSuggestions(true)}
                placeholder={t.searchPlace}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-14 py-4 outline-none text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all text-lg"
              />
              <button className="absolute right-2 bg-slate-900 text-white p-3 rounded-lg hover:bg-slate-800 transition-colors">
                <ArrowRight className="w-5 h-5"/>
              </button>
              
              {/* Autocomplete Dropdown */}
              {showSuggestions && searchQuery && filteredServices.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in">
                  {filteredServices.map(s => (
                    <button key={s} onClick={() => handleServiceSelect(s)} className="w-full text-left px-6 py-4 text-slate-700 hover:bg-slate-50 hover:text-blue-600 border-b border-slate-100 last:border-0 font-medium transition-colors flex items-center gap-3">
                      <Search className="w-4 h-4 text-slate-400" /> {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-sm font-bold text-slate-900 mb-4">{t.popServices}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Home, label: "Housing Scheme", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: FileText, label: "Income Certificate", color: "text-yellow-600", bg: "bg-yellow-50" },
                { icon: Building, label: "Property Records", color: "text-green-600", bg: "bg-green-50" },
                { icon: Layers, label: "Other Services", color: "text-purple-600", bg: "bg-purple-50" },
              ].map((service, idx) => (
                <button key={idx} onClick={() => handleServiceSelect(service.label)} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all text-center flex flex-col items-center gap-3 group">
                  <div className={`w-12 h-12 rounded-full ${service.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <service.icon className={`w-6 h-6 ${service.color}`} />
                  </div>
                  <span className="font-semibold text-sm text-slate-700">{service.label}</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- SCREEN 3: ORCHESTRATION / CONSENT ---
  if (step === 3 || step === 4) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <ChatWidget />
        <div className="bg-white rounded-3xl w-full max-w-4xl min-h-[600px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <button onClick={() => setStep(step - 1)} className="absolute top-8 left-8 text-slate-400 hover:text-slate-900 flex items-center gap-2 text-sm font-semibold z-20">
             ← Back
          </button>
          
          {step === 3 ? (
            <div className="max-w-2xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-4xl font-serif text-center text-slate-900 mb-12 italic">We understood your request! ✨</h2>
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-12 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <Home className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{serviceContext}</h3>
                  <p className="text-slate-500 text-sm">We'll check information from multiple departments securely.</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-4">Systems that will be involved</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                  <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm">
                    <User className="w-5 h-5 text-blue-500"/>
                    <span className="text-sm font-semibold text-slate-700">Identity Dept</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm">
                    <FileText className="w-5 h-5 text-yellow-500"/>
                    <span className="text-sm font-semibold text-slate-700">Income Dept</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm">
                    <Building className="w-5 h-5 text-green-500"/>
                    <span className="text-sm font-semibold text-slate-700">Revenue Dept</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={() => setStep(4)} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md">
                  Continue →
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto mt-12 animate-in fade-in slide-in-from-right-8">
               <h2 className="text-3xl font-bold text-slate-900 mb-2">You're in control</h2>
               <p className="text-slate-500 text-sm mb-8 leading-relaxed">Sarkar Seva asks permission for each department and detail it will access. Data is used strictly for this request. Your data. Your control.</p>
               
               <div className="space-y-4 mb-12">
                 {[
                   { name: "Identity Department", details: "Name, [Aadhaar Redacted], Profile", icon: User, color: "text-blue-500" },
                   { name: "Income Department", details: "Generic Income, Tax Details", icon: FileText, color: "text-yellow-500" },
                   { name: "Property Department", details: "Generic Property records", icon: Building, color: "text-green-500" }
                 ].map((dept, i) => (
                   <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50 shadow-sm">
                     <div className="flex items-center gap-4">
                       <div className={`p-2 bg-white rounded-full shadow-sm border border-slate-100 ${dept.color}`}>
                          <dept.icon className="w-4 h-4" />
                       </div>
                       <div>
                         <h4 className="font-bold text-sm text-slate-900">{dept.name}</h4>
                         <p className="text-xs text-slate-500 mt-0.5">{dept.details}</p>
                       </div>
                     </div>
                     <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 text-white"/>
                     </div>
                   </div>
                 ))}
               </div>

               <div className="flex items-center gap-4">
                 <button onClick={() => { setOrchestrationProgress(0); setStep(5); }} className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md flex-1 md:flex-none">
                   Allow access & Execute
                 </button>
                 <button onClick={() => setStep(3)} className="px-8 py-3.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                   Cancel
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- SCREEN 4: AGENT ORCHESTRATION (LIVE) ---
  if (step === 5) {
    const agents = [
      "Request Agent", "Routing Agent", "Data Agents", 
      "Validation Agent", "Consent & Security Agent", "Response Agent"
    ];

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
        <ChatWidget />
        <div className="w-full max-w-4xl relative bg-slate-900/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
            <div>
              <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Live Swarm Execution</div>
              <h2 className="text-2xl font-bold">Agent Orchestration <span className="text-blue-400 text-sm font-normal ml-2 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">Active</span></h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
               <Loader2 className="w-4 h-4 animate-spin text-blue-400"/> Processing...
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 space-y-6 relative">
              <div className="absolute left-[11px] top-4 bottom-4 w-px bg-slate-800 -z-10"></div>
              
              {agents.map((agent, index) => {
                const isActive = orchestrationProgress === index;
                const isPast = orchestrationProgress > index;
                
                return (
                  <div key={index} className={`flex gap-4 ${isActive ? 'opacity-100' : isPast ? 'opacity-50' : 'opacity-30'} transition-opacity duration-500`}>
                    <div className="mt-1 shrink-0">
                      {isPast ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                          <Check className="w-3 h-3 text-white"/>
                        </div>
                      ) : isActive ? (
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-700 bg-slate-900"></div>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {index + 1}. {agent}
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">
                        {index === 0 && "Understanding request intent & scope."}
                        {index === 1 && "Mapping API paths to target departments."}
                        {index === 2 && "Securely fetching encrypted ledgers."}
                        {index === 3 && "Running consistency checks & rules."}
                        {index === 4 && "Applying strict privacy masks."}
                        {index === 5 && "Formatting deterministic output."}
                      </p>

                      {/* Network Graph Visual for Data Agent Step */}
                      {index === 2 && (isActive || isPast) && (
                        <div className="flex flex-wrap gap-3 mt-4">
                           <div className={`text-xs px-3 py-1.5 rounded-md border flex items-center gap-1 ${isPast ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-blue-500/30 bg-blue-500/10 text-blue-400'}`}>
                             <User className="w-3 h-3"/> Identity: {isPast ? 'Verified' : 'Fetching'}
                           </div>
                           <div className={`text-xs px-3 py-1.5 rounded-md border flex items-center gap-1 ${isPast ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'}`}>
                             <FileText className="w-3 h-3"/> Income: {isPast ? 'Verified' : 'Fetching'}
                           </div>
                           <div className={`text-xs px-3 py-1.5 rounded-md border flex items-center gap-1 ${isPast ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-slate-700 bg-slate-800 text-slate-400'}`}>
                             <Building className="w-3 h-3"/> Property: {isPast ? 'Verified' : 'Queue'}
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="w-full md:w-1/2 flex items-center justify-center opacity-70 border-t md:border-t-0 md:border-l border-slate-800 pt-8 md:pt-0 md:pl-8">
              <div className="font-serif italic text-4xl text-center leading-tight">
                <span className="text-blue-400">Multiple agents.</span><br/>One goal.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- SCREEN 5: FINAL RESULT ---
  if (step === 6) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <ChatWidget />
        <div className="bg-white rounded-3xl w-full max-w-4xl p-8 md:p-16 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
          
          <div className="absolute top-12 left-12 hidden md:block">
             <div className="font-serif italic text-2xl text-blue-900 opacity-20">{t.allSync}</div>
          </div>

          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
              <Home className="w-10 h-10 text-blue-600"/>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-3">{serviceContext}</h2>
            <div className="bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full font-black tracking-widest uppercase text-xl mb-4 border border-emerald-200 shadow-sm">
              {t.eligible}
            </div>
            <p className="text-sm text-slate-500 mb-12 max-w-sm">Based on cryptographically verified information from 3 government systems.</p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-2xl mb-12">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center shadow-sm">
                <User className="w-6 h-6 text-blue-500 mb-2"/>
                <span className="text-xs font-bold text-slate-700">Identity</span>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3"/> Verified</span>
              </div>
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center shadow-sm">
                <FileText className="w-6 h-6 text-yellow-500 mb-2"/>
                <span className="text-xs font-bold text-slate-700">Income</span>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3"/> Verified</span>
              </div>
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center shadow-sm">
                <Building className="w-6 h-6 text-green-500 mb-2"/>
                <span className="text-xs font-bold text-slate-700">Property</span>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3"/> Verified</span>
              </div>
            </div>

            <div className="flex items-center gap-12 w-full max-w-md justify-between border-t border-slate-100 pt-8 mb-8">
               <div className="text-left">
                 <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Request ID</div>
                 <div className="text-sm font-mono font-semibold text-slate-900">{txId}</div>
               </div>
               <div className="text-right">
                 <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Timestamp</div>
                 <div className="text-sm font-mono font-semibold text-slate-900">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • Today</div>
               </div>
            </div>

            <button onClick={() => setStep(2)} className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-xl flex items-center gap-2">
              Return to Dashboard <ArrowRight className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- SCREEN 6: DEPT DASHBOARD (ADMIN VIEW) ---
  if (step === 10) {
    const mockRequests = [
      { id: "TXN-88421", name: "Ramesh Kumar", srv: "Ayushman Bharat", stat: "Cleared" },
      { id: "TXN-11234", name: "John Doe", srv: "Income Cert", stat: "Anomaly" },
      { id: "TXN-99321", name: "Priya Sharma", srv: "PAN Card", stat: "Pending AI" },
      { id: "TXN-77210", name: "Anita Desai", srv: "Housing Scheme", stat: "Cleared" },
    ];

    return (
      <div className="min-h-screen bg-slate-50 flex">
        <ChatWidget />
        <aside className="w-64 bg-[#002147] text-slate-300 flex flex-col h-screen sticky top-0 hidden md:flex border-r border-slate-800">
          <div className="h-1 w-full flex">
             <div className="h-full w-1/3 bg-[#FF9933]"></div><div className="h-full w-1/3 bg-white"></div><div className="h-full w-1/3 bg-[#138808]"></div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 text-white mb-1">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#002147]"><Landmark size={18} /></div>
              <span className="text-xl font-bold tracking-wide">SARKAR SEVA</span>
            </div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-slate-400 pl-11">Maharashtra Govt</div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Activity className="w-5 h-5" /> <span className="font-medium text-sm">{t.deptDash}</span>
            </button>
          </nav>
          <div className="p-4 border-t border-slate-800">
            <button onClick={() => setStep(0)} className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-400 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.deptDash}</h1>
            <LangSelector />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
             <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
               <div className="text-slate-500 text-sm font-semibold mb-1">{t.totalReq}</div>
               <div className="text-3xl font-black text-slate-900">4,281</div>
             </div>
             <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm">
               <div className="text-emerald-700 text-sm font-semibold mb-1">{t.cleared}</div>
               <div className="text-3xl font-black text-emerald-800">3,902</div>
             </div>
             <div className="bg-red-50 p-5 rounded-2xl border border-red-100 shadow-sm">
               <div className="text-red-700 text-sm font-semibold mb-1">Anomalies Detected</div>
               <div className="text-3xl font-black text-red-800">45</div>
             </div>
             <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
               <div className="text-blue-700 text-sm font-semibold mb-1">Processing Swarm</div>
               <div className="text-3xl font-black text-blue-800">334</div>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
             <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
               <h2 className="font-bold text-slate-800 flex items-center gap-2"><Network className="w-5 h-5 text-blue-600"/> Live Agent Transaction Queue</h2>
             </div>
             <div className="overflow-x-auto flex-1 p-6 pt-2">
               <table className="w-full text-left text-sm whitespace-nowrap">
                 <thead className="text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 font-bold">
                   <tr>
                     <th className="py-4">Transaction ID</th>
                     <th className="py-4">Applicant</th>
                     <th className="py-4">Service Type</th>
                     <th className="py-4">Agent Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {mockRequests.map((req, idx) => (
                     <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                       <td className="py-4 font-mono font-medium text-slate-600">{req.id}</td>
                       <td className="py-4 font-bold text-slate-900">{req.name}</td>
                       <td className="py-4 text-slate-600">{req.srv}</td>
                       <td className="py-4">
                         {req.stat === "Cleared" && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1"><CheckCircle2 className="w-3 h-3"/> Cleared</span>}
                         {req.stat === "Anomaly" && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1"><AlertTriangle className="w-3 h-3"/> Anomaly</span>}
                         {req.stat === "Pending AI" && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1"><Activity className="w-3 h-3"/> Pending AI</span>}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}