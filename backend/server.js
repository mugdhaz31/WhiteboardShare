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

io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { name, roomCode, userId, host, presenter } = data;
    socket.join(roomCode);

    const users = addUser({ name, roomCode, userId, host, presenter, socketId: socket.id });

    io.to(roomCode).emit("allUsers", users);
    io.to(roomCode).emit("userJoinedMessage", { name });

    socket.emit("userIsJoined", { success: true, users });
  });

  socket.on("drawing", ({ roomCode, element }) => {
    socket.to(roomCode).emit("receiveDrawing", element);
  });

  socket.on("updateElements", ({ roomCode, elements }) => {
    socket.to(roomCode).emit("receiveElements", elements);
  });

  socket.on("sendChatMessage", ({ roomCode, user, message, timestamp }) => {
     console.log("Emitting message to room:", roomCode);
    io.to(roomCode).emit("receiveChatMessage", { user, message, timestamp });
  // socket.to(roomCode).emit("newMessageNotification", { sender: user });
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(socket.id);
      const usersInRoom = getUserInRoom(user.roomCode);
      socket.broadcast.to(user.roomCode).emit("userDisconnected", user.name);
      socket.broadcast.to(user.roomCode).emit("allUsers", usersInRoom);
    }
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

server.listen(8080, () => {
  console.log("Server Started on port 8080");
});
