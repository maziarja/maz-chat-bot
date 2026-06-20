import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "hello world" });
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
