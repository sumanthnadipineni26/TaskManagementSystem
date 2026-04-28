import { useTasks } from "../context/TaskContext";

/**
 * Notification Component
 * - Toast-style notification for real-time events
 * - Auto-dismisses after 3.5 seconds (handled in TaskContext)
 */
export default function Notification() {
  const { notification } = useTasks();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[70] animate-[slideUp_0.3s_ease]">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-brand-600 text-white rounded-2xl shadow-xl shadow-brand-600/30">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <p className="text-sm font-medium">{notification}</p>
      </div>
    </div>
  );
}
