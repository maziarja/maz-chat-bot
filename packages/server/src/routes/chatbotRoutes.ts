import express from "express";
import chatbotController from "../controllers/chatbotControllers";

const router = express.Router();

router.post("/api/chat", chatbotController);

export default router;
