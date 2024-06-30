const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: true,
});

// const emailToSocketIdMap = new Map();
// const socketidToEmailMap = new Map();
const socketIdToUserMap = new Map();
const UserToSocketIdMap = new Map();   //

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);

  socket.on("room:join", (data) => {
    // const { email, room } = data;
    // emailToSocketIdMap.set(email, socket.id);
    // socketidToEmailMap.set(socket.id, email);
    const { name, room } = data;
    UserToSocketIdMap.set(name, socket.id);//
    socketIdToUserMap.set(socket.id, name);
    socket.join(room);
    io.to(room).emit("user:joined", { name, id: socket.id });
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer,name }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer,name });
  });

  socket.on("call:accepted", ({ to, ans,name }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans,name });
  });

  socket.on("call:rejected", ({ to, name }) => {
    console.log(`Call rejected by ${name}, notifying ${to}`);
    io.to(to).emit("call:rejected", { name });
  });

  socket.on("send:message", ({ to, message }) => {
    const senderName = socketIdToUserMap.get(socket.id);
    io.to(to).emit("receive:message", { from: socket.id, message,name: senderName });
  });

  socket.on("send:file", ({ to, fileMessage }) => {
    io.to(to).emit("receive:file", { from: socket.id, fileMessage });
  });

  socket.on("video:toggle", ({ to, enabled }) => {
    io.to(to).emit("video:toggle", { enabled });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });


});

