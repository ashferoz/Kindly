import express from 'express'
import authController from '../controllers/auth'
import {validateRegistrationData, validateLoginData, validateRefreshToken} from '../validators/auth'
import { checkErrors } from '../validators/checkErrors'

const router = express.Router()

router.put("/register", validateRegistrationData, checkErrors, authController.register)

router.post("/login", validateLoginData, checkErrors, authController.login)

router.post("/refresh", validateRefreshToken, checkErrors, authController.refresh)

export default router