import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { globalErrorMiddleware } from "./src/globalErrorMiddleware";
import chatbotRoute from "./src/routes/chatbotRoutes";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (_req, res) => {
   res.json({ healthy: "ok" });
});

app.use(chatbotRoute);

app.use(globalErrorMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
