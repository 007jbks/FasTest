"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Home,
  Database,
  User,
  Settings,
  X,
  Mail,
  FileText,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";

const base_url = "http://localhost:8000";

export default function Repository() {
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

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // ← NEW

  // Modal states
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    description: "",
    projectUrl: "",
  });

  /* ===========================================================
     FETCH PROJECTS + MERGE PASS PERCENTAGE FOR EACH PROJECT
  ============================================================*/
  useEffect(() => {
    const loadProjects = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      try {
        // Load project list
        const res = await fetch(`${base_url}/api/projects-with-stats`, {
          headers: { token },
        });

        if (!res.ok) return;

        const data = await res.json();
        let list = data.projects;

        // Fetch pass percentage for each project
        const promises = list.map(async (p) => {
          const statsRes = await fetch(
            `${base_url}/api/project-test-stats/${p.id}`,
            { headers: { token } },
          );

          if (!statsRes.ok) return p;

          const stats = await statsRes.json();

          return {
            ...p,
            passPercentage: stats.percentage.toFixed(2), // 2 decimals
            totalTests: stats.total_tests ?? p.totalTests,
          };
        });

        const final = await Promise.all(promises);

        setProjects(final);
      } catch (err) {
        console.error("Error loading projects:", err);
      }

      setLoading(false);
    };

    loadProjects();
  }, []);

  /* ===========================================================
     OPEN EDIT MODAL
  ============================================================*/
  const openEditModal = (project) => {
    setSelectedProject(project);

    setEditData({
      name: project.name,
      description: project.description,
      projectUrl: project.projectUrl,
    });

    setEditModal(true);
  };

  /* ===========================================================
     SAVE EDITS
  ============================================================*/
  const saveEdits = async () => {
    if (!selectedProject) return;

    const token = localStorage.getItem("userToken");

    const body = {
      projectName: editData.name,
      businessLogic: editData.description,
      projectUrl: editData.projectUrl,
    };

    try {
      await fetch(`${base_url}/api/projects/${selectedProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify(body),
      });

      // Refresh
      window.location.reload();
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  /* ===========================================================
     DELETE PROJECT
  ============================================================*/
  const deleteProject = async () => {
    if (!selectedProject) return;

    const token = localStorage.getItem("userToken");

    try {
      await fetch(`${base_url}/api/projects/${selectedProject.id}`, {
        method: "DELETE",
        headers: { token },
      });

      setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
      setDeleteModal(false);
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const navItems = [
    { icon: Home, label: "Home", active: false, link: "./dashboard" },
    { icon: Database, label: "Repository", active: true, link: "./repository" },
    { icon: User, label: "Account", active: false, link: "./account" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      {/* ===========================================================
          SIDEBAR
      ============================================================*/}
      <div className="w-60 backdrop-blur-xl bg-white/5 border-r border-white/10 transition-all duration-300 relative z-10">
        <div className="p-6">
          {/* Nav */}
          <nav className="space-y-2 mt-8">
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

      {/* ===========================================================
          MAIN CONTENT
      ============================================================*/}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Project Repository</h1>

          <Link href="/Project">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:scale-105 shadow-lg">
              <PlusCircle size={20} />
              Create New Project
            </button>
          </Link>
        </header>

        {/* ===========================================================
            LOADING STATE
        ============================================================*/}
        {loading && (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-bold">Loading projects…</h2>
            <p className="text-gray-400 mt-2">Please wait.</p>
          </div>
        )}

        {/* ===========================================================
            EMPTY
        ============================================================*/}
        {!loading && projects.length === 0 && (
          <h2 className="text-gray-300 text-lg">No projects found.</h2>
        )}

        {/* ===========================================================
            PROJECT GRID
        ============================================================*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/30 transition"
            >
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="text-gray-300 text-sm mt-1 mb-4">{p.description}</p>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">Total Tests</p>
                  <p className="font-bold">{p.totalTests}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Pass Rate</p>
                  <p
                    className={`font-bold ${
                      p.passPercentage > 90
                        ? "text-green-400"
                        : "text-yellow-300"
                    }`}
                  >
                    {p.passPercentage}%
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
                    onClick={() => {
                      localStorage.setItem("selectedProjectId", String(p.id));
                      window.location.href = `/routes?project_id=${p.id}`;
                    }}
                  >
                    View
                  </button>

                  <button
                    onClick={() => openEditModal(p)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProject(p);
                      setDeleteModal(true);
                    }}
                    className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===========================================================
          EDIT MODAL
      ============================================================*/}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-slate-900 p-6 rounded-xl border border-white/10 w-96">
            <h2 className="text-xl font-bold mb-4">Edit Project</h2>

            <input
              className="w-full p-2 mb-3 rounded bg-white/10 border border-white/20"
              placeholder="Project Name"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            <textarea
              className="w-full p-2 mb-3 rounded bg-white/10 border border-white/20"
              placeholder="Business Logic"
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
            />

            <input
              className="w-full p-2 mb-4 rounded bg-white/10 border border-white/20"
              placeholder="Project URL"
              value={editData.projectUrl}
              onChange={(e) =>
                setEditData({ ...editData, projectUrl: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-purple-500 rounded hover:bg-purple-600"
                onClick={saveEdits}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===========================================================
          DELETE MODAL
      ============================================================*/}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-slate-900 p-6 rounded-xl border border-white/10 w-80">
            <h2 className="text-xl font-bold mb-4">Delete Project?</h2>

            <p className="text-gray-300 mb-4">
              This will permanently delete the project and its tests.
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
                onClick={deleteProject}
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
