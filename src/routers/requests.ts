import express from "express";
import requestsController from '../controllers/requests';

const router = express.Router()


router.get('/requests', requestsController.getAllRequests)


export default router;