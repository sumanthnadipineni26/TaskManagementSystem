import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

/**
 * AuthProvider
 * - Manages JWT token and user state
 * - Persists auth in localStorage
 * - Provides login, register, logout helpers
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist changes
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      setToken(data.token);
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Registration failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.token);
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
