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

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));


const server = createServer(app);
const io = connectToSocket(server);

// app.set("mongo_userID", process.env.USER_ID);
app.get("/", (req, res) => {
  return res.json({ hello: "World" });
});


app.use("/api/v1/users", userRouters);
const start = async () => {
  const connettionDB = await mongoose.connect(
    `mongodb+srv://${app.get("mongo_USER")}:${app.get(
      "mongo_PASS"
    )}@myzoom.cimztif.mongodb.net/myZoom?appName=MyZoom`
  );

  //   `mongodb+srv://${app.get("mongo_USER")}:${app.get(
  //     "mongo_PASS"
  //   )}@myzoom.cimztif.mongodb.net/?appName=MyZoom`;

  //  `mongodb+srv://${app.get("mongo_USER")}:${app.get(
  //    "mongo_PASS"
  //  )}@myzoom.cimztif.mongodb.net/`;
  console.log(`MONGO Connected DB HOST: ${connettionDB.connection.host}`);

  server.listen(app.get("port"), () => {
    console.log(`LISTENIN ON PORT ${app.get("port")}`);
  });
};

start();
