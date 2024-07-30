import express from "express";
import requestsController from "../controllers/requests";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/requests", requestsController.getAllRequests);

router.post("/requests/id", auth, requestsController.getRequestsByBeneficiary);

router.put("/requests", auth, requestsController.addRequest);

router.delete("/requests/:request_id", auth, requestsController.deleteOneRequestById);

router.patch("/requests/:request_id", auth, requestsController.updateRequestById);

router.put("/requests/:request_id", auth, requestsController.connectToRequest);

router.post("/connected/volunteer", auth, requestsController.getVolunteersConnectedRequests);

router.post("/connected/beneficiary", auth, requestsController.getBeneficiariesConnectedRequests);

router.delete('/connection/:connection_id', auth, requestsController.deleteConnectionById)

export default router;
