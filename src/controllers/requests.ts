import { Response, Request } from "express";
import pool from "../db/db";
import {
  AddRequestBody,
  GetRequestBody,
  DelRequestParams,
  UpdateRequestBody,
  UpdateRequestParams,
  ConnectToRequestBody,
  ConnectToRequestParams,
} from "../interfaces/RequestTypes";

const getAllRequests = async (req: Request, res: Response) => {
  try {
    const allRequests = await pool.query(`
      SELECT r.*, u.username AS username
      FROM requests r
      JOIN users u ON r.beneficiary_uuid = u.uuid`);
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

const getRequestsByBeneficiary = async (
  req: Request<{}, {}, GetRequestBody>,
  res: Response
) => {
  try {
    const allRequestsByBeneficiary = await pool.query(
      "SELECT * FROM requests WHERE beneficiary_uuid = $1",
      [req.body.beneficiary_uuid]
    );
    res.json(allRequestsByBeneficiary.rows);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({
        status: "error",
        msg: "Error getting requests by beneficiary",
      });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const addRequest = async (
  req: Request<{}, {}, AddRequestBody>,
  res: Response
) => {
  try {
    const addNewRequest = `INSERT INTO requests (beneficiary_uuid, title, details, category, urgency, location) VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [
      req.body.beneficiary_uuid,
      req.body.title,
      req.body.details,
      req.body.category,
      req.body.urgency,
      req.body.location,
    ];
    await pool.query(addNewRequest, values);
    res.json({ status: "ok", msg: "Request added" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Error adding request" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const deleteOneRequestById = async (
  req: Request,
  res: Response
) => {
  try {
    await pool.query(`DELETE FROM requests WHERE id = $1`, [
      req.params.request_id,
    ]);
    res.json({ status: "ok", msg: "Request deleted" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Error deleting request" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};


const updateRequestById = async (
  req: Request,
  res: Response
) => {
  try {
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

    if (req.body.category) {
      setClause.push(`category = $${values.length + 1}`);
      values.push(req.body.category);
    }

    if (req.body.urgency) {
      setClause.push(`urgency = $${values.length + 1}`);
      values.push(req.body.urgency);
    }

    if (req.body.location) {
      setClause.push(`location = $${values.length + 1}`);
      values.push(req.body.location);
    }

    if (req.body.status) {
      setClause.push(`status = $${values.length + 1}`);
      values.push(req.body.status);
    }

    const updateRequest = `UPDATE requests SET ${setClause.join(
      ", "
    )} WHERE id = $${values.length + 1}`;
    values.push(req.params.request_id);

    await pool.query(updateRequest, values);
    res.json({ status: "ok", msg: "Request updated" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Error updating request" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};


const connectToRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const checkConnection = await pool.query(
      "SELECT 1 FROM connect_users WHERE volunteer_uuid = $1 AND request_id = $2",
      [req.body.volunteer_uuid, req.params.request_id] 
    );

    if (checkConnection.rows.length > 0) { 
      return res.status(400).json({ status: "error", msg: "Already connected to this request" });
    }

    const connectRequest = `INSERT INTO connect_users (volunteer_uuid, request_id, beneficiary_uuid) VALUES($1, $2, $3)`;
    const values = [req.body.volunteer_uuid, req.params.request_id, req.body.beneficiary_uuid];
    await pool.query(connectRequest, values);
    res.json({ status: "ok", msg: "User is connected" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Error connecting user" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};


const getVolunteersConnectedRequests = async (
  req: Request, 
  res: Response
) => {
  try {
    const allRequests = await pool.query(
      `SELECT cu.id AS connection_id, cu.*, r.*, u.username AS beneficiary_username
     FROM connect_users cu
     JOIN requests r ON cu.request_id = r.id 
     JOIN users u ON r.beneficiary_uuid = u.uuid
     WHERE cu.volunteer_uuid = $1`,
      [req.body.volunteer_uuid]
    );
    res.json(allRequests.rows);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Error getting connected requests" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const getBeneficiariesConnectedRequests = async (
  req: Request, 
  res: Response
) => {
  try {
    const allRequests = await pool.query(
      `SELECT cu.id AS connection_id, cu.*, r.*, u.username AS volunteer_username, u.bio AS bio
      FROM connect_users cu
      JOIN requests r ON cu.request_id = r.id 
      JOIN users u ON cu.volunteer_uuid = u.uuid
      WHERE cu.beneficiary_uuid = $1;`,
      [req.body.beneficiary_uuid]
    );

    res.json(allRequests.rows);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Error getting connected requests" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const deleteConnectionById = async (req: Request, res: Response) => {
  try {
    await pool.query(`DELETE FROM connect_users WHERE id = $1`, [
      req.params.connection_id,
    ]);
    res.json({ status: "ok", msg: "Request deleted" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Error deleting connection" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
}


export default {
  getAllRequests,
  getRequestsByBeneficiary,
  addRequest,
  deleteOneRequestById,
  updateRequestById,
  connectToRequest,
  getVolunteersConnectedRequests,
  getBeneficiariesConnectedRequests,
  deleteConnectionById
};
