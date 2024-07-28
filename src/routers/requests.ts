import express from "express";
import requestsController from "../controllers/requests";

const router = express.Router();

router.get("/requests", requestsController.getAllRequests);

router.post("/requests/id", requestsController.getRequestsByBeneficiary);

router.put("/requests", requestsController.addRequest);

router.delete("/requests/:request_id", requestsController.deleteOneRequestById);

router.patch("/requests/:request_id", requestsController.updateRequestById);

router.put("/requests/:connect_request_id", requestsController.connectToRequest)

export default router;
