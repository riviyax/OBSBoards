import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import Member from "./models/Member.js";
import Branding from "./models/Branding.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

/* SOCKET LOGIC */
io.on("connection", async socket => {
  console.log("🟢 Client connected");

  // SEND INITIAL DATA
  const members = await Member.find();
  const branding = await Branding.findOne() || {
    main: "MUDALIANS' MEDIA UNIT",
    sub: "PREFECT DAY - 2026"
  };

  socket.emit("members:update", members);
  socket.emit("branding:update", branding);

  /* MEMBERS */
  socket.on("members:add", async data => {
    await Member.create(data);
    io.emit("members:update", await Member.find());
  });

  socket.on("members:delete", async id => {
    await Member.findByIdAndDelete(id);
    io.emit("members:update", await Member.find());
  });

  /* BRANDING */
  socket.on("branding:update", async data => {
    await Branding.findOneAndUpdate({}, data, { upsert: true });
    io.emit("branding:update", data);
  });

  /* DISPLAY CONTROL */
  socket.on("display:member", index => {
    io.emit("display:member", index);
  });

  socket.on("display:branding", () => {
    io.emit("display:branding");
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});

server.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on ${process.env.PORT}`)
);