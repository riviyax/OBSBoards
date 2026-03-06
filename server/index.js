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

/* SOCKET.IO */
const io = new Server(server, {
  cors: { origin: "*" },
  transports: ["websocket"],
});

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* MONGODB CONNECTION (FIXED FOR ECONNRESET) */
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // 👈 forces IPv4 (VERY IMPORTANT on Windows)
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed");
    console.error(err);
    process.exit(1);
  });

/* SOCKET LOGIC */
io.on("connection", async (socket) => {
  console.log("🟢 Client connected:", socket.id);

  try {
    const members = await Member.find().sort({ createdAt: 1 });
    const branding = (await Branding.findOne()) || {
      main: "MUDALIANS' MEDIA UNIT",
      sub: "PREFECT DAY - 2026",
    };

    socket.emit("members:update", members);
    socket.emit("branding:update", branding);
  } catch (err) {
    console.error("❌ Initial data error", err);
  }

  /* MEMBERS */
  socket.on("members:add", async (data) => {
    try {
      await Member.create(data);
      io.emit("members:update", await Member.find().sort({ createdAt: 1 }));
    } catch (err) {
      console.error("❌ Add member error", err);
    }
  });

  socket.on("members:delete", async (id) => {
    try {
      await Member.findByIdAndDelete(id);
      io.emit("members:update", await Member.find().sort({ createdAt: 1 }));
    } catch (err) {
      console.error("❌ Delete member error", err);
    }
  });

  /* BRANDING */
  socket.on("branding:update", async (data) => {
    try {
      await Branding.findOneAndUpdate({}, data, { upsert: true });
      io.emit("branding:update", data);
    } catch (err) {
      console.error("❌ Branding update error", err);
    }
  });

  /* DISPLAY CONTROL */
  socket.on("display:member", (index) => {
    io.emit("display:member", index);
  });

  socket.on("display:branding", () => {
    io.emit("display:branding");
  });


  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

/* START SERVER */
server.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on ${process.env.PORT}`);
});
