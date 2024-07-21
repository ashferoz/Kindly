import express from "express";
import requestsController from '../controllers/requests';

const router = express.Router()


router.get('/requests', requestsController.getAllRequests)

router.get('/requests/id', requestsController.getRequestsByBeneficiary)

router.put('/requests', requestsController.addRequest)

router.delete('/requests/:request_id', requestsController.deleteOneRequestById)

export default router;