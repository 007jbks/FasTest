"use client";

import { useState } from "react";
import {
  Menu,
  Home,
  FolderGit2,
  User,
  Settings,
  X,
  Database,
  Mail,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function APITestGenerator() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    apiUrl: "",
    requestFormat: "",
    businessLogic: "",
    testCase: "",
  });
  const navItems = [
    { icon: Home, label: "Home", active: true, link: "./dashboard" },
    {
      icon: Database,
      label: "Repository",
      active: false,
      link: "./repository",
    },
    { icon: User, label: "Account", active: false, link: "./dashboard" },
    { icon: Settings, label: "Settings", active: false, link: "./dashboard" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateTests = () => {
    console.log("Generating tests with:", formData);
    // Add your test generation logic here
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
        {/* Subtle gradient overlay */}
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

      {/* Toggle Button for Closed Sidebar */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 text-gray-300 hover:text-white transition-all duration-200 p-2 hover:bg-white/10 rounded-lg backdrop-blur-xl border border-white/20"
        >
          <Menu size={24} />
        </button>
      )}
      {/* Main Content */}
      <div className="flex-1 relative">
        <div className="absolute top-0 left-0 p-6 z-20">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
            >
              <Menu size={24} />
            </button>
          )}
        </div>

        {/* Form Container - Glassmorphic */}
        <div className="flex items-center justify-center h-full px-8 relative z-10">
          <div className="w-full max-w-2xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl relative">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

            <div className="space-y-6 relative">
              {/* API URL Input */}
              <input
                type="text"
                name="apiUrl"
                value={formData.apiUrl}
                onChange={handleInputChange}
                placeholder="Enter the URL of the API"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:bg-white/15 transition-all duration-300 hover:border-white/30"
              />

              {/* Request Format Textarea */}
              <textarea
                name="requestFormat"
                value={formData.requestFormat}
                onChange={handleInputChange}
                placeholder="Enter the request format of the API"
                rows="3"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:bg-white/15 transition-all duration-300 hover:border-white/30 resize-none"
              />

              {/* Business Logic Textarea */}
              <textarea
                name="businessLogic"
                value={formData.businessLogic}
                onChange={handleInputChange}
                placeholder="Describe the business logic of the API"
                rows="3"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:bg-white/15 transition-all duration-300 hover:border-white/30 resize-none"
              />

              {/* Test Case Input */}
              <textarea
                name="testCase"
                value={formData.testCase}
                onChange={handleInputChange}
                placeholder="Enter any example test case (Optional)"
                rows="2"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:bg-white/15 transition-all duration-300 hover:border-white/30 resize-none"
              />

              {/* Generate Button */}
              <div className="flex justify-end pt-6">
                <Link href="./results">
                  <button
                    onClick={handleGenerateTests}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
                  >
                    Generate Tests
                    <span>→</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
