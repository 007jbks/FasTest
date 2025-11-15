"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  Home,
  Database,
  User,
  Settings,
  X,
  Search,
  ChevronLeft,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

export default function RouteTests() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // TESTS LOADED FROM BACKEND
  const [tests, setTests] = useState([]);

  // MODALS
  const [selectedTest, setSelectedTest] = useState(null);
  const [editingTest, setEditingTest] = useState(null);

  // IDs
  const [projectId, setProjectId] = useState(null);
  const [routeId, setRouteId] = useState(null);

  /* --------------------- LOAD PROJECT + ROUTE IDs --------------------- */
  useEffect(() => {
    const pid = localStorage.getItem("selectedProjectId");
    const rid = localStorage.getItem("selectedRouteId");

    if (pid) setProjectId(Number(pid));
    if (rid) setRouteId(Number(rid));
  }, []);

  /* --------------------- LOAD TESTS FOR THIS ROUTE --------------------- */
  useEffect(() => {
    if (!projectId || !routeId) return;

    const load = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/routes/${routeId}/tests`, {
        headers: { token },
      });

      if (res.ok) {
        const data = await res.json();

        const mapped = data.tests.map((t) => ({
          id: t.id,
          name: t.body.test_name,
          status: t.passed ? "Passed" : "Failed",
          lastRun: "N/A",
          request: {
            method: t.body.request_method,
            url: t.body.route_url,
            headers: t.body.request_headers,
            body: t.body.request_body,
          },
          response: {
            statusCode: t.body.expected_status_code,
            body: t.body.expected_response_body,
          },
          rawBody: t.body,
        }));

        setTests(mapped);
      }
    };

    load();
  }, [projectId, routeId]);

  /* ------------------ DELETE TEST ------------------ */
  async function handleDelete(testId) {
    if (!confirm("Delete this test?")) return;

    const token = localStorage.getItem("userToken");

    await fetch(`${API_BASE_URL}/api/tests/${testId}`, {
      method: "DELETE",
      headers: { token },
    });

    setTests(tests.filter((t) => t.id !== testId));
  }

  /* ------------------ SAVE EDITED TEST ------------------ */
  async function handleSave(updated) {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    const res = await fetch(`${API_BASE_URL}/api/tests/${updated.id}`, {
      method: "PUT",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        test: updated.rawBody, // IMPORTANT FIX
      }),
    });

    if (res.ok) {
      setTests(tests.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      console.error(await res.text());
      alert("Update failed");
    }
  }

  /* ------------------ UI ------------------ */
  const navItems = [
    { icon: Home, label: "Home", link: "/dashboard", active: false },
    { icon: Database, label: "Repository", link: "/repository", active: true },
    { icon: User, label: "Account", link: "/account", active: false },
    { icon: Settings, label: "Settings", link: "/settings", active: false },
  ];

  return (
    <>
      {/*=========== VIEW MODAL ===========*/}
      {selectedTest && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-purple-700/50 rounded-xl w-[700px] p-6">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold">{selectedTest.name}</h2>
              <button onClick={() => setSelectedTest(null)}>
                <X size={24} className="text-white" />
              </button>
            </div>

            <h3 className="mt-4 text-white">Request</h3>
            <pre className="bg-black/40 border border-purple-900/30 p-4 rounded-xl">
              {JSON.stringify(selectedTest.request, null, 2)}
            </pre>

            <h3 className="mt-4 text-white">Response</h3>
            <pre className="bg-black/40 border border-purple-900/30 p-4 rounded-xl">
              {JSON.stringify(selectedTest.response, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/*=========== EDIT MODAL ===========*/}
      {editingTest && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-purple-700/50 rounded-xl w-[700px] p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">Edit Test</h2>
              <button onClick={() => setEditingTest(null)}>
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* JSON Editor */}
            <textarea
              className="w-full h-72 bg-black/40 border border-purple-900/30 p-4 rounded-xl"
              value={JSON.stringify(editingTest.rawBody, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);

                  setEditingTest((prev) => ({
                    ...prev,
                    rawBody: {
                      ...prev.rawBody,
                      ...parsed, // merge updates safely
                    },
                  }));
                } catch {
                  // ignore invalid JSON while typing
                }
              }}
            />

            <button
              className="mt-4 px-6 py-2 bg-purple-600 rounded-lg"
              onClick={() => {
                handleSave(editingTest);
                setEditingTest(null);
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/*=========== MAIN PAGE ===========*/}
      <div className="flex h-screen text-white bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        {/* SIDEBAR */}
        <div
          className={`${
            sidebarOpen ? "w-60" : "w-0"
          } backdrop-blur-xl bg-white/5 border-r border-white/10 transition-all duration-300 overflow-hidden`}
        >
          <div className="p-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-300 mb-8"
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>

            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="flex items-center gap-3 p-3"
              >
                <item.icon />
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">
          <header className="flex justify-between mb-8">
            <div>
              <a href="/routes" className="flex items-center gap-2 mb-2">
                <ChevronLeft /> Back to Routes
              </a>
              <h1 className="text-4xl font-bold tracking-wider">Tests</h1>
            </div>

            <a
              href="/main"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
            >
              <PlusCircle /> Generate Test
            </a>
          </header>

          {/* TEST LIST */}
          <div className="space-y-4">
            {tests.map((test) => (
              <div
                key={test.id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 flex justify-between"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedTest(test)}
                >
                  <h2 className="text-xl font-bold">{test.name}</h2>
                </div>

                <div className="flex gap-4">
                  <button
                    className="px-4 py-2 bg-white/10 rounded-lg"
                    onClick={() => setEditingTest(test)}
                  >
                    <Edit size={16} /> Edit
                  </button>

                  <button
                    className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg"
                    onClick={() => handleDelete(test.id)}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
