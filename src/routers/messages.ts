import express from 'express'
import messageController from '../controllers/messages'
const router = express.Router()

router.get("/", messageController.getAllMessages)

router.get("/:connection_id", messageController.getMessagesByConnectionId)

export default router