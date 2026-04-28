import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import socket from "../utils/socket";
import { useAuth } from "./AuthContext";

const TaskContext = createContext();

/**
 * TaskProvider
 * - Fetches tasks from API
 * - Provides CRUD actions
 * - Listens to Socket.io events for real-time sync
 * - Manages filter state (status, priority, search)
 */
export function TaskProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: "", priority: "", search: "" });
  const [notification, setNotification] = useState(null);

  // ─── Fetch tasks ──────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      const { data } = await api.get("/tasks", { params });
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ─── Socket.io real-time listeners ────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    socket.connect();

    socket.on("task:created", (task) => {
      setTasks((prev) => [task, ...prev]);
      showNotification(`New task: "${task.title}"`);
    });

    socket.on("task:updated", (updated) => {
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      showNotification(`Task updated: "${updated.title}"`);
    });

    socket.on("task:deleted", ({ _id }) => {
      setTasks((prev) => prev.filter((t) => t._id !== _id));
      showNotification("A task was deleted");
    });

    return () => {
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
      socket.disconnect();
    };
  }, [isAuthenticated]);

  // ─── CRUD helpers ─────────────────────────────────────
  const createTask = async (taskData) => {
    const { data } = await api.post("/tasks", taskData);
    // Socket event will update state, but also return data
    return data;
  };

  const updateTask = async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    return data;
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
  };

  // ─── Notification ─────────────────────────────────────
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        filters,
        setFilters,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        notification,
        showNotification,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
