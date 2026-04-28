const mongoose = require("mongoose");

/**
 * Task Schema
 * - title, description, status, priority, dueDate
 * - assignedTo / createdBy reference the User model
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Index for common queries
taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Task", taskSchema);
