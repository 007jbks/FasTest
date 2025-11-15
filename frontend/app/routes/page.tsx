"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Menu,
  Home,
  Database,
  User,
  Settings,
  X,
  Search,
  ChevronLeft,
  Filter,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";

const base_url = "http://localhost:8000";

export default function ProjectRoutes() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project_id");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [routes, setRoutes] = useState([]);
  const [projectName, setProjectName] = useState("Project");

  // MODALS
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // currently selected route
  const [selectedRoute, setSelectedRoute] = useState(null);

  // edit form
  const [editData, setEditData] = useState({
    routename: "",
    method: "GET",
  });

  /** --------------------------
   * FETCH ROUTES + PROJECT INFO
   ---------------------------*/
  useEffect(() => {
    if (!projectId) return;

    const fetchRoutes = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      try {
        const p = await fetch(`${base_url}/api/projects/${projectId}`, {
          headers: { token },
        });
        if (p.ok) {
          const pdata = await p.json();
          setProjectName(pdata.projectName);
        }

        const res = await fetch(
          `${base_url}/api/projects/${projectId}/routes`,
          {
            headers: { token },
          },
        );

        if (res.ok) {
          const data = await res.json();
          setRoutes(data.routes || []);
        }
      } catch (err) {
        console.error("Error fetching routes:", err);
      }
    };

    fetchRoutes();
  }, [projectId]);

  /** --------------------------
   * OPEN EDIT MODAL
   ---------------------------*/
  const openEditModal = (route) => {
    setSelectedRoute(route);
    setEditData({
      routename: route.routename,
      method: route.method || "GET",
    });
    setEditModal(true);
  };

  /** --------------------------
   * SAVE ROUTE EDITS
   ---------------------------*/
  const saveRouteEdits = async () => {
    if (!selectedRoute) return;

    const token = localStorage.getItem("userToken");
    const body = {
      routename: editData.routename,
      method: editData.method,
    };

    try {
      const res = await fetch(`${base_url}/api/routes/${selectedRoute.id}`, {
        method: "PUT",
        headers: {
          token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        // refresh routes
        const updated = await fetch(
          `${base_url}/api/projects/${projectId}/routes`,
          { headers: { token } },
        ).then((r) => r.json());

        setRoutes(updated.routes);
        setEditModal(false);
      }
    } catch (err) {
      console.error("Error updating route:", err);
    }
  };

  /** --------------------------
   * DELETE ROUTE
   ---------------------------*/
  const deleteRoute = async () => {
    if (!selectedRoute) return;

    const token = localStorage.getItem("userToken");

    try {
      const res = await fetch(`${base_url}/api/routes/${selectedRoute.id}`, {
        method: "DELETE",
        headers: { token },
      });

      if (res.ok) {
        setRoutes(routes.filter((r) => r.id !== selectedRoute.id));
        setDeleteModal(false);
      }
    } catch (err) {
      console.error("Error deleting route:", err);
    }
  };

  /** --------------------------
   * UI STARTS HERE
   ---------------------------*/
  const navItems = [
    { icon: Home, label: "Home", active: false, link: "/dashboard" },
    { icon: Database, label: "Repository", active: true, link: "/repository" },
    { icon: User, label: "Account", active: false, link: "/account" },
    { icon: Settings, label: "Settings", active: false, link: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden">
      {/* SIDEBAR */}
      <div
        className={`${
          sidebarOpen ? "w-60" : "w-0"
        } backdrop-blur-xl bg-white/5 border-r border-white/10 flex flex-col transition-all duration-300 overflow-hidden z-10`}
      >
        <div className="p-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-8 text-gray-300 hover:text-white p-2 hover:bg-white/10 rounded-lg border border-white/10"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  item.active
                    ? "bg-purple-500/30 text-white border border-purple-400/30"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 text-gray-300 p-2 rounded-lg border border-white/20 hover:bg-white/10"
        >
          <Menu size={24} />
        </button>
      )}

      {/* MAIN */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <a
              href="/repository"
              className="flex items-center gap-2 text-gray-300 hover:text-white mb-2"
            >
              <ChevronLeft size={20} />
              Back to Repository
            </a>
            <h1 className="text-4xl font-bold tracking-wider">
              {projectName} — Routes
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search routes..."
                className="pl-12 pr-4 py-3 bg-white/10 text-white rounded-xl border border-white/20"
              />
            </div>
            <button className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 flex items-center gap-2">
              <Filter size={20} />
              Filter
            </button>
          </div>
        </header>

        {/* EMPTY */}
        {routes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <h2 className="text-2xl font-bold mb-4">No Routes Found</h2>
            <p className="text-gray-400 mb-6">
              Generate tests to automatically create routes.
            </p>

            <Link href={`/main`}>
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:scale-105 shadow-lg flex items-center gap-2">
                <PlusCircle size={22} />
                Create Tests
              </button>
            </Link>
          </div>
        )}

        {/* ROUTES LIST */}
        <div className="space-y-4">
          {routes.map((route) => (
            <div
              key={route.id}
              className="bg-white/10 border border-white/20 rounded-2xl p-6 flex justify-between items-center shadow-lg hover:shadow-purple-500/20"
            >
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                    {route.method}
                  </span>
                  <h2 className="text-xl font-mono">{route.routename}</h2>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div>
                  <p className="text-gray-400 text-sm">Total Tests</p>
                  <p className="text-2xl font-bold">{route.totalTests}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Pass Rate</p>
                  <p
                    className={`text-2xl font-bold ${
                      route.passPercentage > 90
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {route.passPercentage}%
                  </p>
                </div>

                <button
                  className="px-6 py-3 bg-white/10"
                  onClick={() => {
                    localStorage.setItem("selectedRouteId", route.id);
                    window.location.href = `/tests`;
                  }}
                >
                  View Tests
                </button>

                <button
                  onClick={() => openEditModal(route)}
                  className="p-3 bg-white/10 rounded-xl hover:bg-white/20"
                >
                  <Edit size={20} />
                </button>

                <button
                  onClick={() => {
                    setSelectedRoute(route);
                    setDeleteModal(true);
                  }}
                  className="p-3 bg-red-500/20 rounded-xl hover:bg-red-500/30 text-red-300"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Edit Route</h2>

            <input
              className="w-full p-2 mb-3 bg-white/10 rounded-lg border border-white/20"
              placeholder="Route Name"
              value={editData.routename}
              onChange={(e) =>
                setEditData({ ...editData, routename: e.target.value })
              }
            />

            <select
              className="w-full p-2 mb-6 bg-white/10 rounded-lg border border-white/20"
              value={editData.method}
              onChange={(e) =>
                setEditData({ ...editData, method: e.target.value })
              }
            >
              {["GET", "POST", "PUT", "DELETE", "PATCH"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-purple-500 rounded hover:bg-purple-600"
                onClick={saveRouteEdits}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-xl w-80">
            <h2 className="text-xl font-bold mb-4">Delete Route?</h2>

            <p className="text-gray-300 mb-4">
              This will permanently delete this route and all its tests.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
                onClick={deleteRoute}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
