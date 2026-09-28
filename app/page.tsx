'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  ShieldCheck, 
  Bot, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Building2, 
  FileCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'services' | 'tracker' | 'ai' | 'admin'>('services');
  const [appId, setAppId] = useState('');
  const [statusResult, setStatusResult] = useState<null | { status: string; service: string; date: string }>(null);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Namaste! I am your Sarkar Seva AI Assistant. How can I help you with government schemes or document verification today?' }
  ]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId) return;
    setStatusResult({
      status: 'In Review (Verification Pending)',
      service: 'Aadhaar & Address Update',
      date: '2026-03-28'
    });
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;
    const newHistory = [...chatHistory, { sender: 'user', text: chatQuery }];
    setChatHistory(newHistory);
    setChatQuery('');
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        { sender: 'ai', text: `I have processed your query regarding "${chatQuery}". For this request, you will need your verified ID and proof of residence. Would you like me to guide you through uploading them?` }
      ]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Banner / Gov Header */}
      <header className="bg-indigo-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Sarkar Seva</h1>
              <p className="text-xs text-indigo-300">Unified Citizen Services & AI Governance Portal</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <span className="bg-indigo-800 px-3 py-1 rounded-full text-indigo-200 border border-indigo-700">🇮🇳 Digital India</span>
            <button 
              onClick={() => setActiveTab('admin')}
              className="text-indigo-200 hover:text-white transition flex items-center space-x-1"
            >
              <UserCheck className="w-4 h-4" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex space-x-8 overflow-x-auto">
          {[
            { id: 'services', label: 'Citizen Services', icon: FileText },
            { id: 'tracker', label: 'Track Application', icon: Search },
            { id: 'ai', label: 'AI Assistant', icon: Bot },
            { id: 'admin', label: 'Admin Dashboard', icon: UserCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                  isActive 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-indigo-700 to-blue-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <span className="bg-indigo-800 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center space-x-1 mb-4 border border-indigo-500">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> AI-Powered Governance
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                  Fast, Transparent & Secure Government Services
                </h2>
                <p className="text-indigo-100 text-base mb-6">
                  Apply for documents, check scheme eligibility, and get instant assistance without standing in long queues.
                </p>
                <button 
                  onClick={() => setActiveTab('ai')}
                  className="bg-white text-indigo-900 font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-indigo-50 transition flex items-center space-x-2"
                >
                  <span>Chat with AI Assistant</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Service Cards Grid */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Popular Citizen Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Aadhaar & ID Updates', desc: 'Update demographic details and download verified digital certificates.', icon: ShieldCheck },
                  { title: 'Ration & Food Security', desc: 'Apply for family ration cards and track monthly entitlement distribution.', icon: FileCheck },
                  { title: 'Pension & Welfare Schemes', desc: 'Check eligibility and apply for old age, widow, and disability pensions.', icon: FileText },
                  { title: 'Grievance Redressal', desc: 'Lodge civic complaints and track resolution status in real-time.', icon: HelpCircle },
                  { title: 'Income & Caste Certificates', desc: 'Instant verification and digital issuance of state revenue documents.', icon: Building2 },
                  { title: 'AI Scheme Matcher', desc: 'Let AI analyze your profile and recommend eligible government schemes.', icon: Sparkles },
                ].map((service, idx) => {
                  const SIcon = service.icon;
                  return (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition group cursor-pointer">
                      <div className="bg-indigo-50 w-12 h-12 rounded-lg flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <SIcon className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-lg text-slate-800 mb-2">{service.title}</h4>
                      <p className="text-slate-600 text-sm mb-4">{service.desc}</p>
                      <div className="text-indigo-600 text-sm font-medium flex items-center space-x-1 group-hover:translate-x-1 transition">
                        <span>Apply Now</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TRACKER TAB */}
        {activeTab === 'tracker' && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-fadeIn">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Track Application Status</h3>
            <p className="text-slate-600 text-sm mb-6">Enter your unique application reference ID below to check live status.</p>
            
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Application ID / Reference Number</label>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    placeholder="e.g. SKR-2026-8941" 
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
                    Search
                  </button>
                </div>
              </div>
            </form>

            {statusResult && (
              <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100 animate-fadeIn">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                  <div>
                    <h4 className="font-bold text-slate-800">{statusResult.service}</h4>
                    <p className="text-xs text-slate-500">Submitted on: {statusResult.date}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Current Status</span>
                  <p className="text-lg font-semibold text-slate-800 mt-1">{statusResult.status}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI ASSISTANT TAB */}
        {activeTab === 'ai' && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px] animate-fadeIn">
            <div className="p-4 bg-indigo-900 text-white rounded-t-2xl flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">Sarkar Seva AI Support</h3>
                <p className="text-xs text-indigo-300">Online • Ask questions in any regional language</p>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md p-4 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-800 shadow-sm border border-slate-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="p-4 bg-white border-t border-slate-200 flex space-x-2">
              <input 
                type="text" 
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                placeholder="Ask about schemes, documents, or application steps..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
              />
              <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition flex items-center space-x-1">
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        {/* ADMIN DASHBOARD TAB */}
        {activeTab === 'admin' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Admin Control Center</h3>
                <p className="text-slate-600 text-sm">Overview of citizen applications and automated verifications.</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
                🟢 System Operational
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Applications', value: '1,482', change: '+12% this week' },
                { label: 'Pending Review', value: '143', change: 'Requires Attention' },
                { label: 'AI Auto-Verified', value: '1,120', change: '84% success rate' },
                { label: 'Active Schemes', value: '28', change: 'All active' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-slate-800 mt-2">{stat.value}</p>
                  <p className="text-xs text-indigo-600 mt-2 font-medium">{stat.change}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4">Recent Citizen Submissions</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-3 font-semibold">Reference ID</th>
                      <th className="pb-3 font-semibold">Citizen Name</th>
                      <th className="pb-3 font-semibold">Service Type</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { id: 'SKR-8941', name: 'Rahul Sharma', service: 'Aadhaar Update', status: 'Pending Review' },
                      { id: 'SKR-8942', name: 'Priya Patel', service: 'Ration Card', status: 'Approved' },
                      { id: 'SKR-8943', name: 'Amit Kumar', service: 'Old Age Pension', status: 'AI Verified' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 font-medium text-indigo-600">{row.id}</td>
                        <td className="py-3 text-slate-800">{row.name}</td>
                        <td className="py-3 text-slate-600">{row.service}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            row.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            row.status === 'AI Verified' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <button className="text-indigo-600 hover:text-indigo-800 font-medium">Review</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 Sarkar Seva • Empowering Citizens with Next-Generation Governance</p>
      </footer>
    </div>
  );
}