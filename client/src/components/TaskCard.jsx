/**
 * TaskCard Component
 * - Displays task info: title, priority badge, due date, assignee
 * - HTML5 draggable for Kanban drag & drop
 */
export default function TaskCard({ task, onEdit, onDelete }) {
  const priorityColors = {
    high: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
    low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  };

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  // ─── Drag handlers ─────────────────────────────────────
  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task._id);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="group bg-white dark:bg-surface-800 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-4 shadow-sm hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-brand-500/5 cursor-grab active:cursor-grabbing transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Header: priority + actions */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-400 hover:text-brand-500 transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm mb-1 line-clamp-2">{task.title}</h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Footer: date + assignee */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
        {formattedDate ? (
          <span className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-500 font-semibold" : "text-gray-400"}`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </span>
        ) : (
          <span />
        )}
        {task.assignedTo && (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold" title={task.assignedTo.name}>
            {task.assignedTo.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
