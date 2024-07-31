import express from "express";
import usersController from "../controllers/users";
import auth from "../middleware/auth";
import {validateUserUpdateRequest} from '../validators/users'
import { checkErrors } from "../validators/checkErrors";

const router = express.Router();

router.get("/", usersController.getAllUsers);

router.delete("/", usersController.deleteOneUserByUUID)

router.patch("/", auth, validateUserUpdateRequest, checkErrors, usersController.updateUserByUUID)

router.post('/profile', auth, usersController.getUserByUUID)

export default router;