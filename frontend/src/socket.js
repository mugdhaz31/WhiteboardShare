import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:8080";

export const socket = io(SERVER_URL, {
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
});
