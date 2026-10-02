"use client";

import React, { useState, useEffect } from "react";
import { 
  Building, User, FileText, CheckCircle2, 
  Search, Shield, Activity, Layers, ArrowRight, Home, List, 
  HelpCircle, Check, Loader2, Landmark
} from "lucide-react";

export default function SarkarSevaApp() {
  // Navigation State to replicate the video's flow
  const [step, setStep] = useState(0);

  // Simulated typing and loading states
  const [searchQuery, setSearchQuery] = useState("");
  const [orchestrationProgress, setOrchestrationProgress] = useState(0);

  // Auto-progress the orchestration screen to mimic the video's live agent view
  useEffect(() => {
    if (step === 5) {
      const interval = setInterval(() => {
        setOrchestrationProgress((prev) => {
          if (prev >= 6) {
            clearInterval(interval);
            setTimeout(() => setStep(6), 1000); // Move to Final Result
            return 6;
          }
          return prev + 1;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step]);

  // --- SCREEN 0: LANDING PAGE ---
  if (step === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans flex flex-col">
        <header className="flex justify-between items-center p-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Layers className="text-white w-5 h-5"/>
            </div>
            <span className="font-bold text-xl tracking-tight">Sarkar Seva</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="text-blue-600">Home</a>
            <a href="#">About</a>
            <a href="#">How it Works</a>
          </nav>
          <button onClick={() => setStep(1)} className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">
            Get Started
          </button>
        </header>

        <main className="flex-1 flex items-center justify-between max-w-7xl mx-auto w-full px-8">
          <div className="max-w-xl space-y-6">
            <h1 className="text-6xl font-serif text-slate-900 leading-tight">
              Government services <br />
              <span className="italic text-blue-600 font-semibold">connected.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-md">
              One request. Multiple departments. One coordinated journey.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <button onClick={() => setStep(1)} className="bg-slate-900 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg">
                Start a request <ArrowRight className="w-4 h-4"/>
              </button>
              <button className="flex items-center gap-2 text-slate-600 font-medium hover:text-slate-900">
                <CheckCircle2 className="w-5 h-5 text-slate-400"/> Watch how it works
              </button>
            </div>
            <div className="pt-12 text-slate-400 italic font-serif text-xl opacity-70">
              Same you.<br/>Better process.<br/>Faster services.
            </div>
          </div>
          
          <div className="hidden lg:flex relative w-[500px] h-[500px] items-center justify-center">
            <div className="absolute w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center z-10 shadow-2xl shadow-blue-500/30">
              <Layers className="text-white w-10 h-10"/>
              <span className="absolute -bottom-8 font-bold text-slate-900">Sarkar Seva</span>
            </div>
            <div className="absolute top-10 w-16 h-16 bg-white border border-blue-100 shadow-xl rounded-full flex items-center justify-center -translate-y-12">
              <User className="text-blue-500 w-6 h-6"/>
              <span className="absolute -top-6 text-sm font-bold text-blue-600">Identity</span>
            </div>
            <div className="absolute left-10 w-16 h-16 bg-white border border-yellow-100 shadow-xl rounded-full flex items-center justify-center -translate-x-12">
              <FileText className="text-yellow-500 w-6 h-6"/>
              <span className="absolute -left-16 text-sm font-bold text-yellow-600">Income</span>
            </div>
            <div className="absolute right-10 w-16 h-16 bg-white border border-green-100 shadow-xl rounded-full flex items-center justify-center translate-x-12">
              <Building className="text-green-500 w-6 h-6"/>
              <span className="absolute -right-16 text-sm font-bold text-green-600">Revenue</span>
            </div>
            <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 500 500">
              <circle cx="250" cy="250" r="140" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 6" />
            </svg>
          </div>
        </main>
      </div>
    );
  }

  // --- SCREEN 1: SIGN IN ---
  if (step === 1) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl w-full max-w-5xl flex overflow-hidden shadow-2xl h-[600px]">
          <div className="w-1/2 bg-[#B5C2DF] p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="z-10 text-[#2F3A56]">
              <h2 className="text-2xl font-serif italic mb-1">Mumbai</h2>
              <h1 className="text-4xl font-bold">Gateway of India</h1>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-64 bg-[#a0b0d4] z-0 flex items-end justify-center pb-8">
                <div className="w-48 h-48 border-8 border-[#8b9bc2] rounded-t-[100px] border-b-0 flex items-end justify-center">
                    <div className="w-32 h-32 border-8 border-[#8b9bc2] rounded-t-[80px] border-b-0"></div>
                </div>
            </div>
          </div>
          
          <div className="w-1/2 p-16 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <Layers className="text-white w-3 h-3"/>
              </div>
              <span className="font-bold text-sm tracking-tight text-slate-800">Sarkar Seva</span>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back!</h2>
            <p className="text-slate-500 mb-10 text-sm">Log in to continue to Sarkar Seva.</p>

            <div className="flex border-b border-slate-200 mb-8">
              <button className="flex-1 pb-4 border-b-2 border-slate-900 font-bold text-slate-900 text-sm">Mobile / Email</button>
              <button className="flex-1 pb-4 font-medium text-slate-400 text-sm">Aadhaar</button>
            </div>

            <div className="space-y-4">
              <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 transition-all">
                <div className="px-4 py-4 bg-slate-100 border-r border-slate-200 text-slate-600 font-medium text-sm flex items-center">
                  +91
                </div>
                <input 
                  type="text" 
                  placeholder="Enter your mobile number" 
                  className="flex-1 px-4 py-4 bg-transparent outline-none text-slate-900 text-sm placeholder:text-slate-400"
                />
              </div>
              
              <button onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-4 h-4"/>
              </button>
              
              <div className="flex items-center gap-4 py-4">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-xs text-slate-400 font-medium">or</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <button className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                Continue with Google
              </button>
            </div>

            <p className="text-center text-xs text-slate-400 mt-8 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3"/> Secure & trusted. Your data is safe with us.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- SCREEN 2: DASHBOARD (Citizen Home) ---
  if (step === 2) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col h-screen sticky top-0">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Layers className="text-white w-3 h-3"/>
            </div>
            <span className="font-bold tracking-tight text-slate-800">Sarkar Seva</span>
          </div>

          <nav className="flex-1 space-y-2">
            <button className="w-full flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl font-semibold text-sm">
              <Home className="w-5 h-5"/> Home
            </button>
            <button className="w-full flex items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium text-sm transition-colors">
              <FileText className="w-5 h-5"/> New Request
            </button>
            <button className="w-full flex items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium text-sm transition-colors">
              <List className="w-5 h-5"/> My Requests
            </button>
            <button className="w-full flex items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium text-sm transition-colors">
              <User className="w-5 h-5"/> Profile
            </button>
          </nav>

          <div className="space-y-2 mt-auto">
            <button className="w-full flex items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium text-sm transition-colors">
              <HelpCircle className="w-5 h-5"/> Help
            </button>
            <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-100 mt-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">MC</div>
              <div className="text-sm font-semibold text-slate-700">Manya</div>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-12 max-w-5xl">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Good morning, Manya ☀️</h1>
              <p className="text-slate-500">Let's get your Government work done, together.</p>
            </div>
            <div className="text-right">
              <span className="font-serif italic text-blue-600 text-xl block">Your request</span>
              <span className="font-serif italic text-blue-600 text-xl block">matters</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-12">
            <h2 className="text-sm font-bold text-slate-900 mb-4">What do you need today?</h2>
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Check my housing scheme eligibility..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 outline-none text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all text-lg"
              />
              <button 
                onClick={() => setStep(3)}
                className="absolute right-2 bg-slate-900 text-white p-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <ArrowRight className="w-5 h-5"/>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Popular Services</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: Home, label: "Housing Scheme", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: FileText, label: "Income Certificate", color: "text-yellow-600", bg: "bg-yellow-50" },
                { icon: Building, label: "Property Records", color: "text-green-600", bg: "bg-green-50" },
                { icon: Layers, label: "Other Services", color: "text-purple-600", bg: "bg-purple-50" },
              ].map((service, idx) => (
                <button key={idx} onClick={() => setStep(3)} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-all text-center flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${service.bg} flex items-center justify-center`}>
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

  // --- SCREEN 3: REQUEST REVIEW & CONSENT ---
  if (step === 3 || step === 4) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl w-full max-w-4xl min-h-[600px] p-12 shadow-2xl relative">
          <button onClick={() => setStep(step - 1)} className="absolute top-8 left-8 text-slate-400 hover:text-slate-900 flex items-center gap-2 text-sm font-semibold">
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
                  <h3 className="font-bold text-lg text-slate-900">Housing Scheme Eligibility</h3>
                  <p className="text-slate-500 text-sm">We'll check information from multiple departments.</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-4">Systems that will be involved</h4>
                <div className="flex gap-4 mb-12">
                  <div className="flex-1 bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm">
                    <User className="w-5 h-5 text-blue-500"/>
                    <span className="text-sm font-semibold text-slate-700">Identity Dept</span>
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm">
                    <FileText className="w-5 h-5 text-yellow-500"/>
                    <span className="text-sm font-semibold text-slate-700">Income Dept</span>
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm">
                    <Building className="w-5 h-5 text-green-500"/>
                    <span className="text-sm font-semibold text-slate-700">Revenue Dept</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={() => setStep(4)} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                  Continue →
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto mt-12 animate-in fade-in slide-in-from-right-8">
               <h2 className="text-3xl font-bold text-slate-900 mb-2">You're in control</h2>
               <p className="text-slate-500 text-sm mb-8">Sarkar Seva asks permission for each department and each detail it will access — data is used only for this request and access can be revoked anytime. Your data. Your control. Our responsibility.</p>
               
               <div className="space-y-4 mb-12">
                 {[
                   { name: "Identity Department", details: "Name, [Aadhaar Redacted], Profile", icon: User, color: "text-blue-500" },
                   { name: "Income Department", details: "Generic Income, Tax Details", icon: FileText, color: "text-yellow-500" },
                   { name: "Property Department", details: "Generic Property records", icon: Building, color: "text-green-500" }
                 ].map((dept, i) => (
                   <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                     <div className="flex items-center gap-4">
                       <div className={`p-2 bg-white rounded-full shadow-sm border border-slate-100 ${dept.color}`}>
                          <dept.icon className="w-4 h-4" />
                       </div>
                       <div>
                         <h4 className="font-bold text-sm text-slate-900">{dept.name}</h4>
                         <p className="text-xs text-slate-500">{dept.details}</p>
                       </div>
                     </div>
                     <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white"/>
                     </div>
                   </div>
                 ))}
               </div>

               <div className="flex items-center gap-4">
                 <button onClick={() => setStep(5)} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                   Allow access
                 </button>
                 <button onClick={() => setStep(3)} className="px-8 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">
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
      "Request Agent", 
      "Routing Agent", 
      "Data Agents", 
      "Validation Agent", 
      "Consent & Security Agent", 
      "Response Agent"
    ];

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
        <div className="w-full max-w-4xl relative">
          <div className="flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
            <div>
              <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Request ID: GV-00102</div>
              <h2 className="text-2xl font-bold">Agent Orchestration <span className="text-blue-400 text-sm font-normal ml-2 bg-blue-900/30 px-2 py-1 rounded-full">(Live)</span></h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium bg-slate-800 px-4 py-2 rounded-full">
               <Loader2 className="w-4 h-4 animate-spin text-blue-400"/> Processing...
            </div>
          </div>

          <div className="flex">
            <div className="w-1/2 space-y-6 relative">
              <div className="absolute left-[11px] top-4 bottom-4 w-px bg-slate-800 -z-10"></div>
              
              {agents.map((agent, index) => {
                const isActive = orchestrationProgress === index;
                const isPast = orchestrationProgress > index;
                
                return (
                  <div key={index} className={`flex gap-4 ${isActive ? 'opacity-100' : isPast ? 'opacity-50' : 'opacity-30'} transition-opacity duration-500`}>
                    <div className="mt-1 shrink-0">
                      {isPast ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white"/>
                        </div>
                      ) : isActive ? (
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]">
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
                        {index === 0 && "Understanding your request"}
                        {index === 1 && "Identifying required departments"}
                        {index === 2 && "Verifying records across departments"}
                        {index === 3 && "Checking data consistency"}
                        {index === 4 && "Ensuring secure data exchange"}
                        {index === 5 && "Preparing final response"}
                      </p>

                      {index === 2 && (isActive || isPast) && (
                        <div className="flex gap-3 mt-4">
                           <div className={`text-xs px-3 py-1.5 rounded-md border ${isPast ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-blue-500/30 bg-blue-500/10 text-blue-400'}`}>
                             <User className="w-3 h-3 inline mr-1"/> Identity: {isPast ? 'Verified' : 'Verifying...'}
                           </div>
                           <div className={`text-xs px-3 py-1.5 rounded-md border ${isPast ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'}`}>
                             <FileText className="w-3 h-3 inline mr-1"/> Income: {isPast ? 'Verified' : 'Verifying...'}
                           </div>
                           <div className={`text-xs px-3 py-1.5 rounded-md border ${isPast ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-slate-700 bg-slate-800 text-slate-400'}`}>
                             <Building className="w-3 h-3 inline mr-1"/> Property: {isPast ? 'Verified' : 'Pending'}
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="w-1/2 flex items-center justify-center opacity-70">
              <div className="font-serif italic text-3xl text-center leading-relaxed">
                Multiple agents.<br/>One goal.
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
        <div className="bg-white rounded-3xl w-full max-w-4xl p-16 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
          
          <div className="absolute top-12 left-12">
             <div className="font-serif italic text-2xl text-blue-900 opacity-20">All systems <br/>in sync!</div>
          </div>

          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
              <Home className="w-8 h-8 text-blue-600"/>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Housing Scheme Eligibility</h2>
            <div className="bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full font-black tracking-widest uppercase text-xl mb-4 border border-emerald-200">
              Eligible
            </div>
            <p className="text-sm text-slate-500 mb-12">Based on verified information from 3 government systems.</p>

            <div className="flex justify-center gap-6 w-full max-w-2xl mb-12">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center">
                <User className="w-5 h-5 text-blue-500 mb-2"/>
                <span className="text-xs font-bold text-slate-700">Identity</span>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3"/> Verified</span>
              </div>
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center">
                <FileText className="w-5 h-5 text-yellow-500 mb-2"/>
                <span className="text-xs font-bold text-slate-700">Income</span>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3"/> Verified</span>
              </div>
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center">
                <Building className="w-5 h-5 text-green-500 mb-2"/>
                <span className="text-xs font-bold text-slate-700">Property</span>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3"/> Verified</span>
              </div>
            </div>

            <div className="flex items-center gap-12 w-full max-w-md justify-between border-t border-slate-100 pt-8 mb-8">
               <div className="text-left">
                 <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Request ID</div>
                 <div className="text-sm font-mono font-semibold text-slate-900">GV-00102</div>
               </div>
               <div className="text-right">
                 <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Completed at</div>
                 <div className="text-sm font-mono font-semibold text-slate-900">09:43 AM • Today</div>
               </div>
            </div>

            <button onClick={() => setStep(0)} className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2">
              Continue to application <ArrowRight className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}