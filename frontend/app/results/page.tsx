"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Home } from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

/* ---------------- AUTH TOKEN ---------------- */
async function getAuthToken() {
  const token = localStorage.getItem("userToken");
  if (!token) throw new Error("Not logged in");
  return token;
}

/* ---------------- BACKEND CALLS ---------------- */
async function saveTests(tests, projectId) {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/api/save-tests`, {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
    body: JSON.stringify({ tests, project_id: projectId }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function updateTest(testId, data) {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/api/tests/${testId}`, {
    method: "PUT",
    headers: { token, "Content-Type": "application/json" },
    body: JSON.stringify({ test: data }),
  });

  if (!res.ok) throw new Error("Failed to update");
  return res.json();
}

/* ---------------- MAIN PAGE ---------------- */
export default function GeneratedTestsPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem("userToken");

      // No token → redirect
      if (!token) {
        router.push("/login");
        return;
      }

      // Decode payload
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Expired token → redirect
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("userToken");
        router.push("/login");
        return;
      }
    } catch {
      // Malformed token → redirect
      localStorage.removeItem("userToken");
      router.push("/login");
    }
  }, []);
  const [tests, setTests] = useState([]);
  const [editing, setEditing] = useState({ id: null, content: "" });

  const [savingOne, setSavingOne] = useState(null);
  const [savedOne, setSavedOne] = useState({});
  const [savingAll, setSavingAll] = useState(false);
  const [savedAll, setSavedAll] = useState(false);

  const [search, setSearch] = useState("");
  const [projectId, setProjectId] = useState(null);

  /* ------------ LOAD PROJECT ID ------------ */
  useEffect(() => {
    const saved = localStorage.getItem("selectedProjectId");
    if (saved) setProjectId(Number(saved));
  }, []);

  /* ------------ LOAD TESTS FROM LS ------------ */
  useEffect(() => {
    const raw = localStorage.getItem("tests");
    if (!raw) return;

    const arr = JSON.parse(raw);

    const formatted = arr.map((item, idx) => {
      const b = item.body;

      return {
        id: b.test_name || `test-${idx}`,
        name: b.test_name || `Test ${idx + 1}`,
        route: item.route,
        method: item.method,
        testCase: {
          method: b.request_method,
          headers: b.request_headers,
          body: b.request_body,
        },
        expected: {
          status_code: b.expected_status_code,
          body: b.expected_response_body,
        },
        original: item,
        dbId: item.test_id || null, // very important
      };
    });

    setTests(formatted);
  }, []);

  /* ------------ NORMALIZE ------------ */
  function normalize(test) {
    return {
      route: test.route,
      method: test.method,
      body: test.original.body,
    };
  }

  /* ------------ SAVE ONE TEST ------------ */
  async function handleSave(test) {
    if (!projectId) return alert("Project ID missing");

    // If already saved disable
    if (savedOne[test.id]) return;

    setSavingOne(test.id);

    try {
      const res = await saveTests([normalize(test)], projectId);

      // Backend returns: { tests: [{ test_id: X }] }
      const insertedId = res.tests?.[0]?.test_id;

      setTests((prev) =>
        prev.map((t) => (t.id === test.id ? { ...t, dbId: insertedId } : t)),
      );

      setSavedOne((prev) => ({ ...prev, [test.id]: true }));
    } catch {
      alert("Save failed");
    }

    setSavingOne(null);
  }

  /* ------------ SAVE ALL ------------ */
  async function handleSaveAll() {
    if (savedAll) return;
    if (!projectId) return alert("Project ID missing");

    setSavingAll(true);

    try {
      const res = await saveTests(tests.map(normalize), projectId);

      const ids = res.tests.map((t) => t.test_id);

      setTests((prev) => prev.map((t, i) => ({ ...t, dbId: ids[i] })));

      setSavedAll(true);
      setSavedOne({}); // all individual are saved now
    } catch {
      alert("Save all failed");
    }

    setSavingAll(false);
  }

  /* ------------ SAVE EDIT ------------ */
  async function handleSaveEdit(id) {
    try {
      const parsed = JSON.parse(editing.content);

      const t = tests.find((x) => x.id === id);
      if (!t) return;

      if (t.dbId) {
        await updateTest(t.dbId, parsed);
      }

      setTests((prev) =>
        prev.map((x) =>
          x.id === id
            ? {
                ...x,
                testCase: {
                  method: parsed.request_method,
                  headers: parsed.request_headers,
                  body: parsed.request_body,
                },
                expected: {
                  status_code: parsed.expected_status_code,
                  body: parsed.expected_response_body,
                },
                original: { ...x.original, body: parsed },
              }
            : x,
        ),
      );

      setEditing({ id: null, content: "" });
      alert("Updated!");
    } catch {
      alert("Invalid JSON");
    }
  }

  /* ------------ FILTERED LIST ------------ */
  const filtered = tests.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-10 text-white">
      <div className="flex justify-between items-center mb-10">
        <a href="/dashboard" className="bg-purple-600 px-4 py-2 rounded-lg">
          <Home size={20} />
        </a>
        <h1 className="text-4xl font-bold">Generated Tests</h1>
      </div>

      {/* SEARCH */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
        <input
          className="w-full bg-purple-950/30 border border-purple-900/50 rounded-xl pl-12 pr-4 py-4"
          placeholder="Search tests…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* SAVE ALL */}
      <button
        onClick={handleSaveAll}
        disabled={savedAll}
        className={`mb-8 px-6 py-3 rounded-lg ${
          savedAll
            ? "bg-green-700 opacity-70"
            : savingAll
              ? "bg-yellow-600"
              : "bg-green-600"
        }`}
      >
        {savingAll ? "Saving…" : savedAll ? "All Saved!" : "Save All Tests"}
      </button>

      {/* TEST LIST */}
      <div className="space-y-6">
        {filtered.map((test) => {
          const isEditing = editing.id === test.id;

          return (
            <div
              key={test.id}
              className="bg-black/30 rounded-2xl border border-purple-800 p-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {test.name}{" "}
                  <span className="text-purple-300">({test.route})</span>
                </h2>

                <div className="flex gap-3">
                  {/* SAVE ONE */}
                  <button
                    onClick={() => handleSave(test)}
                    disabled={savedOne[test.id] || test.dbId}
                    className={`px-4 py-2 rounded-lg ${
                      savedOne[test.id] || test.dbId
                        ? "bg-green-700 opacity-60"
                        : savingOne === test.id
                          ? "bg-yellow-600"
                          : "bg-lime-600"
                    }`}
                  >
                    {savingOne === test.id
                      ? "Saving…"
                      : savedOne[test.id] || test.dbId
                        ? "Saved!"
                        : "Save"}
                  </button>

                  {/* EDIT */}
                  <button
                    onClick={() =>
                      setEditing({
                        id: test.id,
                        content: JSON.stringify(test.original.body, null, 2),
                      })
                    }
                    className="bg-blue-600 px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {isEditing ? (
                <>
                  <textarea
                    className="w-full h-48 bg-black/60 border border-purple-700 p-4 rounded-lg"
                    value={editing.content}
                    onChange={(e) =>
                      setEditing({ ...editing, content: e.target.value })
                    }
                  />

                  <button
                    onClick={() => handleSaveEdit(test.id)}
                    className="mt-4 bg-green-600 px-6 py-2 rounded-lg"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <pre className="bg-black/40 p-4 rounded-lg mb-4 max-h-64 overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(test.original.body, null, 2)}
                </pre>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
