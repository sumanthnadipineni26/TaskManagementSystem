import { io } from "socket.io-client";

/**
 * Socket.io client singleton.
 * Connects through the Vite dev proxy (same origin).
 */
const socket = io("/", {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

export default socket;
