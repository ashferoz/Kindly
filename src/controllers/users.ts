import { Response, Request } from "express";
import pool from "../db/db";
import { DelRequestBody } from "../interfaces/UsersTypes";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "error getting all users" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const deleteOneUserByUUID = async (
  req: Request<{}, {}, DelRequestBody>,
  res: Response
) => {
  try {
    await pool.query(`DELETE FROM users WHERE uuid = $1`, [req.body.uuid]);
    res.json({ status: "ok", msg: "User deleted" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Error deleting user" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

export default { getAllUsers, deleteOneUserByUUID };
