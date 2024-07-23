import express from "express";
import categoryController from "../controllers/categories";

const router = express.Router();

router.get("/", categoryController.getAllCategories);

router.put("/", categoryController.addNewCategory)

export default router;
