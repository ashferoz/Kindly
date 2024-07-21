import { Response, Request } from "express";
import connectDB from "../db/db";
import { RequestBody } from '../interfaces/RequestTypes';

const getAllRequests = async (req: Request, res: Response) => {
  try {
    const allRequests = await connectDB.query("SELECT * FROM requests");
    res.json(allRequests.rows);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res
        .status(400)
        .json({ status: "error", msg: "error getting all requests" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const getRequestsByBeneficiary = async (req:Request, res: Response) => {
    try {
        const allRequestsByBeneficiary = await connectDB.query(
            'SELECT * FROM requests WHERE beneficiary_uuid = $1',
            [req.body.beneficiary_uuid] 
          )
          res.json(allRequestsByBeneficiary.rows)
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).json({ status: 'error', msg: 'Error getting requests by beneficiary' });
          } else {
            console.error('An unexpected error occurred:', error);
          } 
    }
}


const addRequest = async (req: Request<{}, {}, RequestBody>, res: Response) => {
    try {
        const addNewRequest = `INSERT INTO requests (beneficiary_uuid, title, details, request_type, request_urgency, request_location) VALUES ($1, $2, $3, $4, $5, $6)`;
        const values = [
            req.body.beneficiary_uuid,
            req.body.title,
            req.body.details,
            req.body.request_type,
            req.body.request_urgency,
            req.body.request_location
          ];
        await connectDB.query(addNewRequest, values)
        res.json({status: "ok", msg: 'Request added' });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).json({ status: 'error', msg: 'Error adding request' });
          } else {
            console.error('An unexpected error occurred:', error);
          } 
    }
}

export default {
  getAllRequests,
  getRequestsByBeneficiary,
  addRequest
};
