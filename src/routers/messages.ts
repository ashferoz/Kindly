import express from 'express'
import messageController from '../controllers/messages'
const router = express.Router()

router.get("/", messageController.getAllMessages)

export default router