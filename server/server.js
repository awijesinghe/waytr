const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

io.on("connection", socket => {
  socket.on("join", ({ uid, name, restaurantId, restName, tableNum }, callback) => {
    const room = `${restaurantId}-${tableNum}`;
    socket.join(room);
    socket.room = room;
    socket.restaurantId = restaurantId;

    if (callback) callback();
  });

  // Customer updates temp order selection — broadcast to the same table
  socket.on("sendTempOrder", (orders, callback) => {
    if (socket.room) {
      io.to(socket.room).emit("order", orders);
    }
    if (callback) callback();
  });

  // Customer confirms and sends the order — notify everyone at the table
  socket.on("sendOrder", (data, callback) => {
    if (socket.room) {
      io.to(socket.room).emit("orderSent");
    }
    if (callback) callback();
  });

  // Customer requests staff (bill or call staff) — notify the table
  socket.on("staffRequest", (requestType, callback) => {
    if (socket.room) {
      const msg =
        requestType === "bill"
          ? "Bill has been requested. Staff will be with you shortly."
          : "Staff has been notified and will be with you shortly.";
      io.to(socket.room).emit("message", msg);
    }
    if (callback) callback();
  });

  socket.on("disconnect", () => {});
});

server.listen(PORT, () => {
  console.log(`Waytr server running on port ${PORT}`);
});
