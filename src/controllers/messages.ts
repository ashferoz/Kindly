import { Request, Response } from "express";
import pool from "../db/db";
import {
  GetMessagesByIdParams,
  DelMessageByIdParams,
  AddMessageToConnectionIdBody,
} from "../interfaces/MessageTypes";

const getAllMessages = async (req: Request, res: Response) => {
  try {
    const getMessages = await pool.query(`SELECT * FROM messages`);
    res.json(getMessages.rows);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res
        .status(400)
        .json({ status: "error", msg: "error getting all messages" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const getMessagesByConnectionId = async (
  req: Request,
  res: Response
) => {
  try {
    const getMessagesById = await pool.query(
      `SELECT * FROM messages WHERE connection_id = $1`,
      [req.params.connection_id]
    );
    res.json(getMessagesById.rows);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({
        status: "error",
        msg: "Error getting requests by connection id",
      });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const deleteMessagesById = async (
  req: Request,
  res: Response
) => {
  try {
    await pool.query(`DELETE FROM messages WHERE id = $1`, [req.params.id]);
    res.json({ status: "ok", msg: "message deleted" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Error deleting message" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const addMessagesToConnectionId = async (
  req: Request<{}, {}, AddMessageToConnectionIdBody>,
  res: Response
) => {
  try {
    const addMessage = `INSERT INTO messages (content, volunteer_uuid, beneficiary_uuid, connection_id) VALUES($1, $2, $3, $4)`;
    const values = [
      req.body.content,
      req.body.volunteer_uuid,
      req.body.beneficiary_uuid,
      req.body.connection_id,
    ];
    await pool.query(addMessage, values);
    res.json({ status: "ok", msg: "message added" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Error adding message" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

export default {
  getAllMessages,
  getMessagesByConnectionId,
  deleteMessagesById,
  addMessagesToConnectionId
};
