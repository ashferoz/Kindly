import {Request, Response} from 'express'
import pool from '../db/db'

const getAllMessages = async (req: Request, res: Response) => {
    try {
        const getMessages = await pool.query(`SELECT * FROM messages`)
        res.json(getMessages.rows)   
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
}

export default {getAllMessages}