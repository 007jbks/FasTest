"use client";

import { useState } from "react";
import { Menu, Home, FolderGit2, User, Settings } from "lucide-react";

export default function APITestGenerator() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    apiUrl: "",
    requestFormat: "",
    businessLogic: "",
    testCase: "",
  });

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
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 bg-gradient-to-b from-purple-900 to-purple-950 overflow-hidden`}
      >
        <div className="p-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-8 p-2 hover:bg-purple-800 rounded transition-colors"
          >
            <Menu size={24} />
          </button>

          <nav className="space-y-4">
            <a
              href="#"
              className="flex items-center gap-3 p-3 hover:bg-purple-800 rounded transition-colors"
            >
              <Home size={20} />
              <span className="font-medium">Home</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 p-3 hover:bg-purple-800 rounded transition-colors"
            >
              <FolderGit2 size={20} />
              <span className="font-medium">Repository</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 p-3 hover:bg-purple-800 rounded transition-colors"
            >
              <User size={20} />
              <span className="font-medium">Account</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 p-3 hover:bg-purple-800 rounded transition-colors"
            >
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </a>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 p-6 space-y-2">
          <a
            href="#"
            className="block text-gray-300 hover:text-white transition-colors"
          >
            Contact Us
          </a>
          <a
            href="#"
            className="block text-gray-300 hover:text-white transition-colors"
          >
            Policies
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        <div className="absolute top-0 left-0 p-6">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
            >
              <Menu size={24} />
            </button>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="absolute top-6 right-6">
          <div className="w-12 h-12 bg-lime-400 rounded-full"></div>
        </div>

        {/* Form Container */}
        <div className="flex items-center justify-center h-full px-8">
          <div className="w-full max-w-2xl bg-gradient-to-br from-purple-900/40 to-purple-950/40 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
            <div className="space-y-6">
              {/* API URL Input */}
              <input
                type="text"
                name="apiUrl"
                value={formData.apiUrl}
                onChange={handleInputChange}
                placeholder="Enter the URL of the API"
                className="w-full px-6 py-4 bg-gray-200 text-gray-900 rounded-xl placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* Request Format Textarea */}
              <textarea
                name="requestFormat"
                value={formData.requestFormat}
                onChange={handleInputChange}
                placeholder="Enter the request format of the API"
                rows="3"
                className="w-full px-6 py-4 bg-gray-200 text-gray-900 rounded-xl placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />

              {/* Business Logic Textarea */}
              <textarea
                name="businessLogic"
                value={formData.businessLogic}
                onChange={handleInputChange}
                placeholder="Describe the business logic of the API"
                rows="3"
                className="w-full px-6 py-4 bg-gray-200 text-gray-900 rounded-xl placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />

              {/* Test Case Input */}
              <textarea
                name="testCase"
                value={formData.testCase}
                onChange={handleInputChange}
                placeholder="Enter any example test case (Optional)"
                rows="2"
                className="w-full px-6 py-4 bg-gray-200 text-gray-900 rounded-xl placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />

              {/* Generate Button */}
              <div className="flex justify-end pt-6">
                <button
                  onClick={handleGenerateTests}
                  className="px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  Generate Tests
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
