import express from "express";
import usersController from "../controllers/users";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/", usersController.getAllUsers);

router.delete("/", auth, usersController.deleteOneUserByUUID)

router.patch("/", auth, usersController.updateUserByUUID)

router.post('/profile', auth, usersController.getUserByUUID)

export default router;
