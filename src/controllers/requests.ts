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

const deleteOneRequestById = async (req: Request, res: Response) => {
    try {
        await connectDB.query(`DELETE FROM requests WHERE request_id = $1`,
        [req.params.request_id])
        res.json({status: "ok", msg: 'Request deleted' });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).json({ status: 'error', msg: 'Error deleting request' });
          } else {
            console.error('An unexpected error occurred:', error);
          } 
    }
}

const updateRequestById = async (req: Request, res: Response) => {
    try {
        // const updateRequest = `UPDATE requests SET (title, details, request_type, request_urgency, request_location, request_status) VALUES ($1, $2, $3, $4, $5, $6) WHERE request_id = $7`;

        // const values = [
        //     req.body.title,
        //     req.body.details,
        //     req.body.request_type,
        //     req.body.request_urgency,
        //     req.body.request_location,
        //     req.body.id
        //   ];

        const setClause = [];
        const values = [];

        if (req.body.title) {
            setClause.push(`title = $${values.length + 1}`);
            values.push(req.body.title);
        }

        if (req.body.details) {
            setClause.push(`details = $${values.length + 1}`);
            values.push(req.body.details);
        }

        if (req.body.request_type) {
            setClause.push(`request_type = $${values.length + 1}`);
            values.push(req.body.request_type);
        }

        if (req.body.request_urgency) {
            setClause.push(`request_urgency = $${values.length + 1}`);
            values.push(req.body.request_urgency);
        }

        if (req.body.request_location) {
            setClause.push(`request_location = $${values.length + 1}`);
            values.push(req.body.request_location);
        }

        if (req.body.request_status) {
            setClause.push(`request_status = $${values.length + 1}`);
            values.push(req.body.request_status);
        }

        const updateRequest = `UPDATE requests SET ${setClause.join(', ')} WHERE request_id = $${values.length + 1}`;
        values.push(req.params.request_id); 

        await connectDB.query(updateRequest, values);
        res.json({ status: "ok", msg: 'Request updated' });

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).json({ status: 'error', msg: 'Error updating request' });
        } else {
            console.error('An unexpected error occurred:', error);
        }
    }
}

export default {
  getAllRequests,
  getRequestsByBeneficiary,
  addRequest,
  deleteOneRequestById,
  updateRequestById
};
