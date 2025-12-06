const { Server } = require("socket.io");

async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.on("connection", (socket) => {
    console.log("new client connected:", socket.id);
  });
}

module.exports = {
  initSocketServer,
};
