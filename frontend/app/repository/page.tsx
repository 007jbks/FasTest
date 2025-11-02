"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileJson,
  Server,
  Route as RouteIcon,
  X,
} from "lucide-react";
import Link from "next/link";

const base_url = "http://127.0.0.1:8000";

function TestDetailModal({ test, onClose }) {
  if (!test) return null;

  const { body } = test;
  const type =
    body.expected_status_code >= 200 && body.expected_status_code < 300
      ? "Positive"
      : "Negative";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-900 to-purple-950/50 border border-purple-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{body.test_name}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-purple-500 rounded"></div>
              Test Case (Request Body):
            </h3>
            <pre className="bg-black/40 border border-purple-900/30 rounded-xl p-4 text-purple-200 text-sm font-mono">
              {JSON.stringify(body.request_body, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-green-500 rounded"></div>
              Expected Outcome:
            </h3>
            <pre className="bg-black/40 border border-purple-900/30 rounded-xl p-4 text-purple-200 text-sm font-mono">
              {JSON.stringify(
                {
                  status_code: body.expected_status_code,
                  body: body.expected_response_body,
                },
                null,
                2,
              )}
            </pre>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-lime-500 rounded"></div>
              Test Type:
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                type === "Positive"
                  ? "bg-lime-500/20 text-lime-400"
                  : "bg-orange-500/20 text-orange-400"
              }`}
            >
              {type}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Repository() {
  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [testsByRoute, setTestsByRoute] = useState({});
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;
      setIsLoading(true);
      try {
        const response = await fetch(`${base_url}/history/url`, {
          headers: { token },
        });
        if (response.ok) {
          const data = await response.json();
          setUrls(data);
        }
      } catch (error) {
        console.error("Failed to fetch URLs:", error);
      }
      setIsLoading(false);
    };
    fetchUrls();
  }, []);

  useEffect(() => {
    const fetchTestsForUrl = async () => {
      if (!selectedUrl) return;
      const token = localStorage.getItem("userToken");
      if (!token) return;
      setIsLoading(true);
      setTestsByRoute({});
      setSelectedRoute(null);
      try {
        const response = await fetch(`${base_url}/history/tests`, {
          method: "POST",
          headers: { "Content-Type": "application/json", token },
          body: JSON.stringify({ id: selectedUrl.url_id }),
        });
        if (response.ok) {
          const testsData = await response.json();
          const grouped = testsData.reduce((acc, test) => {
            try {
              const body = JSON.parse(test.body);
              const routeName = body.route || "uncategorized";
              if (!acc[routeName]) acc[routeName] = [];
              acc[routeName].push({ ...test, body });
              return acc;
            } catch (e) {
              console.warn("Failed to parse test body:", test);
              return acc;
            }
          }, {});
          setTestsByRoute(grouped);
        }
      } catch (error) {
        console.error("Failed to fetch tests:", error);
      }
      setIsLoading(false);
    };
    fetchTestsForUrl();
  }, [selectedUrl]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex flex-col">
      <TestDetailModal
        test={selectedTest}
        onClose={() => setSelectedTest(null)}
      />
      <header className="p-4 border-b border-white/10 backdrop-blur-xl bg-white/5 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">Repository</h1>
      </header>
      <main className="flex-1 flex overflow-hidden">
        <div className="w-1/3 border-r border-white/10 overflow-y-auto">
          <div className="p-4 border-b border-white/10 sticky top-0 backdrop-blur-md bg-slate-950/50">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Server size={18} /> APIs / URLs
            </h2>
          </div>
          {isLoading && !urls.length ? (
            <p className="p-4 text-gray-400">Loading APIs...</p>
          ) : (
            <ul>
              {urls.map((url) => (
                <li key={url.url_id}>
                  <button
                    onClick={() => setSelectedUrl(url)}
                    className={`w-full text-left p-4 flex justify-between items-center transition-colors duration-200 ${
                      selectedUrl?.url_id === url.url_id
                        ? "bg-purple-500/30"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <span className="font-mono">{url.urlname}</span>
                    <ChevronRight size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="w-1/3 border-r border-white/10 overflow-y-auto">
          <div className="p-4 border-b border-white/10 sticky top-0 backdrop-blur-md bg-slate-950/50">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <RouteIcon size={18} /> Routes
            </h2>
          </div>
          {selectedUrl &&
            (isLoading ? (
              <p className="p-4 text-gray-400">Loading routes...</p>
            ) : (
              <ul>
                {Object.keys(testsByRoute).map((route) => (
                  <li key={route}>
                    <button
                      onClick={() => setSelectedRoute(route)}
                      className={`w-full text-left p-4 flex justify-between items-center transition-colors duration-200 ${
                        selectedRoute === route
                          ? "bg-purple-500/30"
                          : "hover:bg-white/10"
                      }`}
                    >
                      <span className="font-mono">{route}</span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {testsByRoute[route].length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ))}
        </div>
        <div className="w-1/3 overflow-y-auto">
          <div className="p-4 border-b border-white/10 sticky top-0 backdrop-blur-md bg-slate-950/50">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileJson size={18} /> Tests
            </h2>
          </div>
          {selectedRoute && (
            <ul className="p-4 space-y-2">
              {testsByRoute[selectedRoute].map((test) => (
                <li key={test.id}>
                  <button
                    onClick={() => setSelectedTest(test)}
                    className="w-full text-left bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
                  >
                    <p className="font-semibold text-white">
                      {test.body.test_name}
                    </p>
                    <p className="text-sm text-gray-400 font-mono">
                      {test.body.request_method}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
