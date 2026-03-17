import { io } from "socket.io-client";
import { SERVER_URL } from "./api";

let socket;

export function connectSocket(token) {
  if (!token) return null;
  if (socket?.connected) return socket;

  socket = io(SERVER_URL, {
    transports: ["websocket"],
    auth: { token }
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
