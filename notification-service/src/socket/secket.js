export const setupSocket = (io) => {
  io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;

  if (userId) {
    socket.join(userId.toString());
    console.log(`✅ User joined room: ${userId}`);
  }

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

};

