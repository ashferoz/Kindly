import { Request, Response } from "express";
import pool from "../db/db";
import { GetMessagesByIdParams } from "../interfaces/MessageTypes";

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
  req: Request<GetMessagesByIdParams, {}, {}>,
  res: Response
) => {
  try {
    const getMessagesById = await pool.query(`SELECT * FROM messages WHERE connection_id = $1`, [req.params.connection_id])
    res.json(getMessagesById.rows)
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

export default { getAllMessages, getMessagesByConnectionId };
