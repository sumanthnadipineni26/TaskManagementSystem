/**
 * Socket.io event handlers
 * - Logs connections/disconnections
 * - Real-time task events are emitted from the route handlers via req.app.get("io")
 */
const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = initSocket;
