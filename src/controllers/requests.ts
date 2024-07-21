import { Response, Request } from "express";
import connectDB from "../db/db";

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

export default {
  getAllRequests,
  getRequestsByBeneficiary
};
