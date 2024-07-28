import express from "express";
import usersController from "../controllers/users";

const router = express.Router();

router.get("/", usersController.getAllUsers);

router.delete("/", usersController.deleteOneUserByUUID)

router.patch("/", usersController.updateUserByUUID)

router.post('/profile', usersController.getUserByUUID)

export default router;
