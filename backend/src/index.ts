import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import authRouter from "./routes/authRoute";
import userRoute from "./routes/userRoute";
import thereadRoute from "./routes/thereadRoute";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const port = 2323;
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);
app.use("/api/thread", thereadRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("SERVER JALAN NJING");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server aktif di http://localhost:${port}`);
});
