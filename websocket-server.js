const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
console.log("WebSocket server starting on port 3002...");
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join:task", ({ taskId }) => {
    socket.join(`task:${taskId}`);
    console.log(`Client ${socket.id} joined task room: ${taskId}`);
  });

  socket.on("leave:task", ({ taskId }) => {
    socket.leave(`task:${taskId}`);
    console.log(`Client ${socket.id} left task room: ${taskId}`);
  });

  socket.on("task:created", (task) => {
    console.log("Task created:", task);
    socket.broadcast.emit("task:created", task);
  });
  socket.on("task:updated", (task) => {
    console.log("Task updated:", task);
    socket.broadcast.emit("task:updated", task);
  });
  socket.on("task:deleted", ({ taskId }) => {
    console.log("Task deleted:", taskId);
    socket.broadcast.emit("task:deleted", { taskId });
  });
  socket.on("task:moved", ({ taskId, newStatus }) => {
    console.log("Task moved:", taskId, newStatus);
    socket.broadcast.emit("task:moved", { taskId, newStatus });
  });

  socket.on("comment:added", ({ taskId, comment }) => {
    console.log("Comment added:", taskId, comment);
    socket.to(`task:${taskId}`).emit("comment:added", { taskId, comment });
  });
  socket.on("comment:deleted", ({ taskId, commentId }) => {
    console.log("Comment deleted:", taskId, commentId);
    socket.to(`task:${taskId}`).emit("comment:deleted", { taskId, commentId });
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
const PORT = process.env.WS_PORT || 3002;
server.listen(PORT, () => {
  console.log(`✅ WebSocket server is running on port ${PORT}`);
  console.log(`   Clients can connect to: ws:
  `);
});
