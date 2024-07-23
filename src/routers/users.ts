import express from "express";
import usersController from "../controllers/users";

const router = express.Router();

router.get("/", usersController.getAllUsers);

router.delete("/", usersController.deleteOneUserByUUID)

export default router;
