import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { Server } from "socket.io";

const server = http.createServer();
const PORT = process.env.PORT || 8000;

const io = new Server(server, {
  cors: {
    origin: "https://blink-chat-pi.vercel.app/",
  },
});

const userMap = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("register", (userID) => {
    userMap[userID] = socket.id;
    console.log("Users: ", userMap);
    io.emit("onlineUsers", Object.keys(userMap));
  });

  socket.on("sendMessage", ({ senderID, recieverID, message }) => {
    if (userMap[recieverID]) {
      io.to(userMap[recieverID]).emit("newMessage", message);
    }
    if (userMap[senderID]) {
      io.to(userMap[senderID]).emit("newMessage", message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected`);
    for (const userId in userMap) {
      if (userMap[userId] === socket.id) {
        delete userMap[userId];
      }
    }
    io.emit("onlineUsers", Object.keys(userMap));
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening to Port: ${PORT}`);
});
