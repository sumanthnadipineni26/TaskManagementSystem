require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const initSocket = require("./socket");

// ─── App & Server ───────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ─── Socket.io ──────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
app.set("io", io); // Make io accessible in routes
initSocket(io);

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ─── Error Handler (must be after routes) ───────────────────
app.use(errorHandler);

// ─── Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
