const express = require("express");
const { body, validationResult } = require("express-validator");
const Task = require("../models/Task");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All task routes require authentication
router.use(protect);

/**
 * GET /api/tasks
 * List tasks with optional filters: status, priority, search, assignedTo
 */
router.get("/", async (req, res, next) => {
  try {
    const { status, priority, search, assignedTo } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    // Text search on title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tasks/:id
 * Get a single task by ID
 */
router.get("/:id", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/tasks
 * Create a new task
 */
router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("status")
      .optional()
      .isIn(["todo", "in-progress", "done"])
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = await Task.create({
        ...req.body,
        createdBy: req.user._id,
      });

      // Populate refs before returning
      await task.populate("assignedTo", "name email");
      await task.populate("createdBy", "name email");

      // Emit real-time event (io is attached to req.app)
      const io = req.app.get("io");
      if (io) io.emit("task:created", task);

      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/tasks/:id
 * Update an existing task
 */
router.put("/:id", async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Emit real-time event
    const io = req.app.get("io");
    if (io) io.emit("task:updated", task);

    res.json(task);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Emit real-time event
    const io = req.app.get("io");
    if (io) io.emit("task:deleted", { _id: req.params.id });

    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
