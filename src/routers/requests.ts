import express from "express";
import  getAllRequests from '../controllers/requests'

const router = express.Router()


router.get('/requests', getAllRequests)


export default router;