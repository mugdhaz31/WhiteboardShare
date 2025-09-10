import { io } from "socket.io-client";

const SERVER_URL = "https://whiteboardshare.onrender.com";

export const socket = io(SERVER_URL, {
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
});
