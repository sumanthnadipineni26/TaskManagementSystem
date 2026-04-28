import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import Notification from "../components/Notification";
import { useTasks } from "../context/TaskContext";

// Column definitions for the Kanban board
const COLUMNS = [
  { id: "todo", label: "To Do", color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { id: "in-progress", label: "In Progress", color: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
  { id: "done", label: "Done", color: "from-emerald-500 to-green-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
];

/**
 * Dashboard Page
 * - Sidebar + three-column Kanban board
 * - HTML5 Drag & Drop to move tasks between columns
 * - Filter bar (search, status, priority)
 * - Create / Edit task via modal
 */
export default function Dashboard() {
  const { tasks, loading, filters, setFilters, createTask, updateTask, deleteTask } = useTasks();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  // ─── Drag & Drop handlers ─────────────────────────────
  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(columnId);
  };

  const handleDragLeave = () => setDragOverCol(null);

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;
    const task = tasks.find((t) => t._id === taskId);
    if (task && task.status !== newStatus) {
      await updateTask(taskId, { status: newStatus });
    }
  };

  // ─── Modal handlers ───────────────────────────────────
  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = async (payload, taskId) => {
    if (taskId) {
      await updateTask(taskId, payload);
    } else {
      await createTask(payload);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this task?")) {
      await deleteTask(id);
    }
  };

  // ─── Task counts ──────────────────────────────────────
  const getColumnTasks = (status) => tasks.filter((t) => t.status === status);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center gap-4">
            {/* Mobile menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Task Board</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{tasks.length} tasks total</p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            id="create-task-button"
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all duration-200 hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Task</span>
          </button>
        </header>

        {/* Filter bar */}
        <div className="px-4 sm:px-8 py-3 bg-white/50 dark:bg-surface-800/50 border-b border-gray-200 dark:border-gray-700/50 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks…"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Priority filter */}
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Reset */}
          {(filters.search || filters.priority) && (
            <button
              onClick={() => setFilters({ status: "", priority: "", search: "" })}
              className="px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Kanban board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-6">
          {loading && tasks.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Loading tasks…</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 sm:gap-6 h-full min-w-[768px]">
              {COLUMNS.map((col) => {
                const columnTasks = getColumnTasks(col.id);
                return (
                  <div
                    key={col.id}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className={`flex-1 flex flex-col rounded-2xl ${col.bg} p-3 sm:p-4 transition-all duration-200 ${
                      dragOverCol === col.id ? "ring-2 ring-brand-400 ring-offset-2 dark:ring-offset-surface-900 scale-[1.01]" : ""
                    }`}
                  >
                    {/* Column header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${col.color}`} />
                        <h2 className="font-bold text-sm">{col.label}</h2>
                        <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-lg bg-white/60 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                          {columnTasks.length}
                        </span>
                      </div>
                    </div>

                    {/* Tasks list */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                      {columnTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                          <svg className="w-10 h-10 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="text-xs">Drop tasks here</p>
                        </div>
                      ) : (
                        columnTasks.map((task) => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Toast notifications */}
      <Notification />
    </div>
  );
}
