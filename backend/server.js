const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { addUser, getUser, removeUser, getUserInRoom } = require("./utils/user");

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

// Basic route
// app.get("/", (req, res) => {
//   res.send("Hello from Express!");
// });

// Socket connection
io.on("connection", (socket) => {

  // When a user joins a room
  socket.on("userJoined", (data) => {
    try {
      const { name, roomCode, userId, host, presenter } = data;

      // Prevent duplicate join
      const existingUser = getUserInRoom(roomCode).find(u => u.userId === userId);
      if (existingUser) {
        socket.emit("error", { message: "User already in room" });
        return;
      }

      socket.join(roomCode);

      const users = addUser({ name, roomCode, userId, host, presenter, socketId: socket.id });

      // Notify others
      socket.broadcast.to(roomCode).emit("userJoinedMessageroadcasted", { user: { name } });
      io.to(roomCode).emit("allUsers", users);

      // Notify new user individually
      socket.emit("userIsJoined", { success: true, users });

    } catch (err) {
      console.error("Error in userJoined:", err);
      socket.emit("error", { message: "Failed to join room", details: err.message });
    }
  });

  // Drawing event
  socket.on("drawing", ({ roomCode, element }) => {
    try {
      socket.to(roomCode).emit("receiveDrawing", element);
    } catch (err) {
      console.error("Error in drawing:", err);
      socket.emit("error", { message: "Failed to send drawing", details: err.message });
    }
  });

  // Update elements (undo/redo/clear)
  socket.on("updateElements", ({ roomCode, elements }) => {
    try {
      socket.to(roomCode).emit("receiveElements", elements);
    } catch (err) {
      console.error("Error in updateElements:", err);
      socket.emit("error", { message: "Failed to update elements", details: err.message });
    }
  });

  // Chat messages
  socket.on("sendChatMessage", ({ roomCode, user, message, timestamp }) => {
    try {
      socket.to(roomCode).emit("receiveChatMessage", { user, message, timestamp });
      socket.to(roomCode).emit("newMessageNotification", { sender: user });
    } catch (err) {
      console.error("Error in sendChatMessage:", err);
      socket.emit("error", { message: "Failed to send chat message", details: err.message });
    }
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    try {
      const user = getUser(socket.id);
      if (user) {
        removeUser(socket.id);
        const usersInRoom = getUserInRoom(user.roomCode);
        socket.broadcast.to(user.roomCode).emit("userDisconnected", user.name);
        socket.broadcast.to(user.roomCode).emit("allUsers", usersInRoom);
      }
    } catch (err) {
      console.error("Error during disconnect:", err);
    }
  });

  // Global error handler for unexpected socket errors
  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

server.listen(8080, () => {
  console.log("Server Started on port 8080");
});
