"use client";
import { useState } from "react";
import {
  Menu,
  Home,
  Database,
  User,
  Settings,
  X,
  Mail,
  FileText,
  ChevronLeft,
  Save,
} from "lucide-react";

export default function ManualTestCreation() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [testName, setTestName] = useState("");
  const [requestBody, setRequestBody] = useState("");
  const [responseBody, setResponseBody] = useState("");

  const navItems = [
    { icon: Home, label: "Home", active: false, link: "/dashboard" },
    {
      icon: Database,
      label: "Repository",
      active: true,
      link: "/repository",
    },
    { icon: User, label: "Account", active: false, link: "/account" },
    { icon: Settings, label: "Settings", active: false, link: "/settings" },
  ];

  const handleSave = () => {
    // Logic to save the manual test
    console.log("Saving test:", { testName, requestBody, responseBody });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden">
      {/* Animated background blur circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div
        className={`${
          sidebarOpen ? "w-60" : "w-0"
        } backdrop-blur-xl bg-white/5 border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out overflow-hidden relative z-10`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-blue-500/5 pointer-events-none"></div>
        <div className="p-6 relative">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-8 text-gray-300 hover:text-white transition-all duration-200 p-2 hover:bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                  item.active
                    ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-400/30 backdrop-blur-sm shadow-lg shadow-purple-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                }`}
              >
                <item.icon
                  size={20}
                  className={`${
                    item.active
                      ? "text-purple-300"
                      : "group-hover:text-purple-300 transition-colors"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-3 text-sm border-t border-white/10 backdrop-blur-sm relative">
          <a
            href="#"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
          >
            <Mail
              size={16}
              className="group-hover:text-purple-300 transition-colors"
            />
            <span>Contact Us</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
          >
            <FileText
              size={16}
              className="group-hover:text-purple-300 transition-colors"
            />
            <span>Policies</span>
          </a>
        </div>
      </div>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 text-gray-300 hover:text-white transition-all duration-200 p-2 hover:bg-white/10 rounded-lg backdrop-blur-xl border border-white/20"
        >
          <Menu size={24} />
        </button>
      )}

      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <a
              href="/tests"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-2"
            >
              <ChevronLeft size={20} />
              Back to Tests
            </a>
            <h1 className="text-4xl font-bold tracking-wider">
              Create Manual Test
            </h1>
          </div>
        </header>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-lg space-y-6">
          <div>
            <label className="text-white font-semibold mb-2 block">
              Test Name
            </label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="e.g., Successfully retrieve user data"
              className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Request Body</h3>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder='{ "method": "GET", "url": "/api/users/1" }'
              className="w-full h-48 bg-black/40 border border-purple-900/30 rounded-xl p-4 text-purple-200 text-sm font-mono"
            />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">
              Expected Response Body
            </h3>
            <textarea
              value={responseBody}
              onChange={(e) => setResponseBody(e.target.value)}
              placeholder='{ "id": 1, "name": "John Doe" }'
              className="w-full h-48 bg-black/40 border border-purple-900/30 rounded-xl p-4 text-purple-200 text-sm font-mono"
            />
          </div>
          <div className="flex justify-end gap-4">
            <a
              href="/tests"
              className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
            >
              Cancel
            </a>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
            >
              <Save size={20} />
              <span>Save Test</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
