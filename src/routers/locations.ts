import express from "express";
import locationController from "../controllers/locations";

const router = express.Router();

router.get("/", locationController.getAllLocations);

router.delete("/:id", locationController.deleteLocationsById);

router.put("/", locationController.addNewLocation)

export default router;
