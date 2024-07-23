import express from "express";
import locationController from "../controllers/locations";

const router = express.Router();

router.get("/", locationController.getAllLocations);

export default router;
