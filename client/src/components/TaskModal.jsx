import { useState, useEffect } from "react";
import api from "../utils/api";

/**
 * TaskModal Component
 * - Create or Edit a task via a slide-in modal
 * - Fetches user list for the "Assign to" dropdown
 */
export default function TaskModal({ task, onSave, onClose }) {
  const isEditing = !!task;

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
  });

  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);

  // Load users for assignment
  useEffect(() => {
    api.get("/auth/users").then(({ data }) => setUsers(data)).catch(() => {});
  }, []);

  // Pre‑fill form when editing
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
        assignedTo: task.assignedTo?._id || "",
      });
    }
  }, [task]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.assignedTo) delete payload.assignedTo;
      if (!payload.dueDate) delete payload.dueDate;
      await onSave(payload, task?._id);
      onClose();
    } catch {
      // error handled upstream
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-surface-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700/50 animate-[fadeIn_0.2s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700/50">
          <h2 className="text-lg font-bold">{isEditing ? "Edit Task" : "Create Task"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-gray-600 dark:text-gray-300">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter task title"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-gray-600 dark:text-gray-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the task…"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow resize-none"
            />
          </div>

          {/* Status + Priority row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-600 dark:text-gray-300">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-600 dark:text-gray-300">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due date + Assign row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-600 dark:text-gray-300">Due Date</label>
              <input
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-600 dark:text-gray-300">Assign To</label>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all duration-200 hover:shadow-xl hover:shadow-brand-500/30"
          >
            {saving ? "Saving…" : isEditing ? "Update Task" : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
