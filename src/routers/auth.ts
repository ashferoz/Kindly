import express from 'express'
import authController from '../controllers/auth'

const router = express.Router()

router.put("/register", authController.register)

router.post("/login", authController.login)

router.post("/refresh", authController.refresh)

export default router