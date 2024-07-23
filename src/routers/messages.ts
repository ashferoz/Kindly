import express from "express";
import messageController from "../controllers/messages";
const router = express.Router();

router.get("/", messageController.getAllMessages);

router.get("/:connection_id", messageController.getMessagesByConnectionId);

router.delete("/:id", messageController.deleteMessagesById);

router.put("/", messageController.addMessagesToConnectionId)

export default router;
