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
     SELECT 
     r.request_id,
     r.title,
     r.details,
     rs.description AS status,
     u.username,
     rc.description AS category,
     rl.description AS location,
     ru.description AS urgency
     FROM requests r
     JOIN users u ON r.user_uuid = u.uuid
     JOIN category rc ON r.request_category = rc.id
     JOIN locations rl ON r.request_location = rl.id
     JOIN statuses rs ON r.request_status = rs.id
     JOIN urgencies ru ON r.request_urgency = ru.id;`);
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
      "SELECT * FROM requests WHERE user_uuid = $1",
      [req.body.user_uuid]
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
    const addNewRequest = `INSERT INTO requests (user_uuid, title, details, request_category, request_urgency, request_location) VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [
      req.body.user_uuid,
      req.body.title,
      req.body.details,
      req.body.request_category,
      req.body.request_urgency,
      req.body.request_location,
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
    await pool.query(`DELETE FROM requests WHERE request_id = $1`, [
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

    if (req.body.request_category) {
      setClause.push(`request_category = $${values.length + 1}`);
      values.push(req.body.request_category);
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

    const updateRequest = `UPDATE requests SET ${setClause.join(
      ", "
    )} WHERE request_id = $${values.length + 1}`;
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
      "SELECT 1 FROM connect_users WHERE volunteer_uuid = $1 AND connect_request_id = $2",
      [req.body.volunteer_uuid, req.params.connect_request_id]
    );

    if (checkConnection.rows[0] > 0) {
      return res.status(400).json({ status: "error", msg: "Already connected to this request" });
    }

    const connectRequest = `INSERT INTO connect_users (volunteer_uuid, connect_request_id) VALUES($1, $2)`;
    const values = [req.body.volunteer_uuid, req.params.connect_request_id];
    await pool.query(connectRequest, values);
    res.json({ status: "ok", msg: "user is connected" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Error conncting user" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const getVolunteersConnectedRequests = async (req: Request, res: Response) => {
  try {
    const allRequests = await pool.query(
      `SELECT cu.*, r.*, u.username AS beneficiary_username
      FROM connect_users cu
      JOIN requests r ON cu.connect_request_id = r.request_id 
      JOIN users u ON r.user_uuid = u.uuid
      WHERE cu.volunteer_uuid = $1`,
      [req.body.volunteer_uuid]
    );
    res.json(allRequests.rows);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res
        .status(400)
        .json({ status: "error", msg: "Error getting connected requests" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

export default {
  getAllRequests,
  getRequestsByBeneficiary,
  addRequest,
  deleteOneRequestById,
  updateRequestById,
  connectToRequest,
  getVolunteersConnectedRequests,
};
