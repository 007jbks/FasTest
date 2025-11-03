"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileJson,
  Server,
  Route as RouteIcon,
  X,
  Trash2,
  Edit,
  Save,
} from "lucide-react";
import Link from "next/link";

const base_url = "http://127.0.0.1:8000";

function TestDetailModal({ test, onClose }) {
  if (!test) return null;

  const { body, created_at } = test;

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

          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-500 rounded"></div>
              Date Created:
            </h3>

            <span className="text-blue-300">
              {new Date(created_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditTestModal({ test, onClose, onSave }) {
  const [name, setName] = useState("");

  const [reqBody, setReqBody] = useState("");

  const [resBody, setResBody] = useState("");

  const [statusCode, setStatusCode] = useState(200);

  const [error, setError] = useState("");

  useEffect(() => {
    if (test) {
      setName(test.body.test_name);

      setReqBody(JSON.stringify(test.body.request_body, null, 2));

      setResBody(JSON.stringify(test.body.expected_response_body, null, 2));

      setStatusCode(test.body.expected_status_code);

      setError("");
    }
  }, [test]);

  if (!test) return null;

  const handleSave = () => {
    let parsedReqBody, parsedResBody;

    try {
      parsedReqBody = JSON.parse(reqBody);
    } catch (e) {
      setError("Request Body is not valid JSON.");

      return;
    }

    try {
      parsedResBody = JSON.parse(resBody);
    } catch (e) {
      setError("Expected Response Body is not valid JSON.");

      return;
    }

    setError("");

    const updatedTestBody = {
      ...test.body,

      test_name: name,

      request_body: parsedReqBody,

      expected_response_body: parsedResBody,

      expected_status_code: statusCode,
    };

    onSave(test.id, updatedTestBody);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-900 to-purple-950/50 border border-purple-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Edit Test Case</h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
          {error && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="text-white font-semibold mb-3 block">
              Test Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/40 border border-purple-900/30 rounded-xl p-4 w-full text-purple-200 font-mono"
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Request Body:</h3>

            <textarea
              value={reqBody}
              onChange={(e) => setReqBody(e.target.value)}
              className="bg-black/40 border border-purple-900/30 rounded-xl p-4 w-full h-40 text-purple-200 font-mono"
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">
              Expected Status Code:
            </h3>

            <input
              type="number"
              value={statusCode}
              onChange={(e) => setStatusCode(parseInt(e.target.value, 10) || 0)}
              className="bg-black/40 border border-purple-900/30 rounded-xl p-4 w-full text-purple-200 font-mono"
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">
              Expected Response Body:
            </h3>

            <textarea
              value={resBody}
              onChange={(e) => setResBody(e.target.value)}
              className="bg-black/40 border border-purple-900/30 rounded-xl p-4 w-full h-40 text-purple-200 font-mono"
            />
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Save size={18} /> Save Changes
          </button>
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

  const [editingTest, setEditingTest] = useState(null);

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

  const handleUpdateTest = async (testId, updatedTestBody) => {
    const token = localStorage.getItem("userToken");

    if (!token) return;

    try {
      const response = await fetch(`${base_url}/api/tests/${testId}`, {
        method: "PUT",

        headers: { "Content-Type": "application/json", token },

        body: JSON.stringify({ test: updatedTestBody }),
      });

      if (response.ok) {
        const result = await response.json();

        setTestsByRoute((prev) => {
          const newTestsByRoute = { ...prev };

          const route = result.test.route;

          if (newTestsByRoute[route]) {
            const testIndex = newTestsByRoute[route].findIndex(
              (t) => t.id === testId,
            );

            if (testIndex !== -1) {
              newTestsByRoute[route][testIndex].body = result.test;
            }
          }

          return newTestsByRoute;
        });

        setEditingTest(null);
      } else {
        console.error("Failed to update test");
      }
    } catch (error) {
      console.error("Failed to update test:", error);
    }
  };

  const handleDeleteTest = async (testId, route) => {
    if (!confirm("Are you sure you want to delete this test?")) return;

    const token = localStorage.getItem("userToken");

    if (!token) return;

    try {
      const response = await fetch(`${base_url}/api/tests/${testId}`, {
        method: "DELETE",

        headers: { token },
      });

      if (response.ok) {
        setTestsByRoute((prev) => {
          const newTestsByRoute = { ...prev };

          if (newTestsByRoute[route]) {
            newTestsByRoute[route] = newTestsByRoute[route].filter(
              (t) => t.id !== testId,
            );

            if (newTestsByRoute[route].length === 0) {
              delete newTestsByRoute[route];

              setSelectedRoute(null);
            }
          }

          return newTestsByRoute;
        });
      } else {
        console.error("Failed to delete test");
      }
    } catch (error) {
      console.error("Failed to delete test:", error);
    }
  };

  const handleDeleteRoute = async (routeName) => {
    if (
      !selectedUrl ||
      !confirm(
        `Are you sure you want to delete the route "${routeName}" and all its tests?`,
      )
    )
      return;

    const token = localStorage.getItem("userToken");

    if (!token) return;

    try {
      const response = await fetch(
        `${base_url}/api/routes/${routeName}/urls/${selectedUrl.url_id}`,

        {
          method: "DELETE",

          headers: { token },
        },
      );

      if (response.ok) {
        setTestsByRoute((prev) => {
          const newTestsByRoute = { ...prev };

          delete newTestsByRoute[routeName];

          return newTestsByRoute;
        });

        setSelectedRoute(null);
      } else {
        console.error("Failed to delete route");
      }
    } catch (error) {
      console.error("Failed to delete route:", error);
    }
  };

  const handleDeleteUrl = async (urlId) => {
    if (!confirm("Are you sure you want to delete this URL and all its tests?"))
      return;

    const token = localStorage.getItem("userToken");

    if (!token) return;

    try {
      const response = await fetch(`${base_url}/api/urls/${urlId}`, {
        method: "DELETE",

        headers: { token },
      });

      if (response.ok) {
        setUrls((prev) => prev.filter((u) => u.url_id !== urlId));

        setSelectedUrl(null);

        setTestsByRoute({});

        setSelectedRoute(null);
      } else {
        console.error("Failed to delete URL");
      }
    } catch (error) {
      console.error("Failed to delete URL:", error);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex flex-col">
      <TestDetailModal
        test={selectedTest}
        onClose={() => setSelectedTest(null)}
      />

      {editingTest && (
        <EditTestModal
          test={editingTest}
          onClose={() => setEditingTest(null)}
          onSave={handleUpdateTest}
        />
      )}

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
                <li key={url.url_id} className="group relative">
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

                  <button
                    onClick={() => handleDeleteUrl(url.url_id)}
                    className="absolute right-12 top-1/2 -translate-y-1/2 p-1 rounded-full bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/40 transition-opacity"
                  >
                    <Trash2 size={16} />
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
                  <li key={route} className="group relative">
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

                    <button
                      onClick={() => handleDeleteRoute(route)}
                      className="absolute right-16 top-1/2 -translate-y-1/2 p-1 rounded-full bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/40 transition-opacity"
                    >
                      <Trash2 size={16} />
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
                <li
                  key={test.id}
                  className="group relative bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
                >
                  <button
                    onClick={() => setSelectedTest(test)}
                    className="w-full text-left"
                  >
                    <p className="font-semibold text-white">
                      {test.body.test_name}
                    </p>

                    <p className="text-sm text-gray-400 font-mono">
                      {test.body.request_method}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(test.created_at).toLocaleDateString()}
                    </p>
                  </button>

                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingTest(test)}
                      className="p-2 rounded-full hover:bg-white/20"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteTest(test.id, selectedRoute)}
                      className="p-2 rounded-full hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
