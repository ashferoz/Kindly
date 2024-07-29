import express from "express";
import messageController from "../controllers/messages";
import auth from "../middleware/auth";
const router = express.Router();

router.get("/", auth, messageController.getAllMessages);

router.get("/:connection_id", auth, messageController.getMessagesByConnectionId);

router.delete("/:id", auth, messageController.deleteMessagesById);

router.put("/", auth, messageController.addMessagesToConnectionId)

export default router;
