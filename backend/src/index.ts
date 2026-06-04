import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import authRouter from "./routes/authRoute";
import userRoute from "./routes/userRoute";
import thereadRoute from "./routes/thereadRoute";
import cors from "cors";

const app = express();
const port = 2323;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);
app.use("/api/thread", thereadRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("SERVER JALAN NJING");
});

app.listen(port, () => {
  console.log(`Server aktif di http://localhost:${port}`);
});
