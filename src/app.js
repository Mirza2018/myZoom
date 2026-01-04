import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { connectToSocket } from "./controllers/socketManager.js";
import userRouters from "./routes/users.route.js";
dotenv.config({ quiet: true });

const app = express();

app.set("port", process.env.PORT || 2018);
app.set("mongo_USER", process.env.DB_USER);
app.set("mongo_PASS", process.env.DB_PASS);
const url = `mongodb+srv://${app.get("mongo_USER")}:${app.get(
  "mongo_PASS"
)}@myzoom.cimztif.mongodb.net/myZoom?appName=MyZoom`;

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

const server = createServer(app);
const io = connectToSocket(server);

app.get("/", (req, res) => {
  return res.json({ hello: "World" });
});

app.use("/api/v1/users", userRouters);

const start = async () => {
  try {
    const res = await mongoose.connect(url);
    console.log(`MONGO Connected DB HOST: ${res.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`Server running on port ${app.get("port")}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

start();
