import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

/**
 * Signup Page
 * - Name + email + password form
 * - Redirects to dashboard on success
 */
export default function Signup() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate("/");
    } catch {
      // error is set in context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 via-brand-50 to-surface-100 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-brand-500/30 mb-4">
            T
          </div>
          <h1 className="text-3xl font-bold">Create account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Get started with TaskFlow for free</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-surface-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700/50 p-8">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold mb-1.5 text-gray-600 dark:text-gray-300">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold mb-1.5 text-gray-600 dark:text-gray-300">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold mb-1.5 text-gray-600 dark:text-gray-300">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all duration-200 hover:shadow-xl"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
