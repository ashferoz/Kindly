import { Response } from "express";
import pool from "../db/db";
import { DelRequestBody, UpdateUserBody } from "../interfaces/UsersTypes";

interface Request {
  decoded?: any;
  body: any;
}

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

const getUserByUUID = async (req: Request, res: Response) => {
  try {
    const userDetails = await pool.query(`SELECT * FROM users WHERE uuid= $1`, [
      req.decoded.uuid,
    ]);
    res.json(userDetails.rows);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res
        .status(400)
        .json({ status: "error", msg: "error getting user's info" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const deleteOneUserByUUID = async (req: Request, res: Response) => {
  try {
    await pool.query(`DELETE FROM users WHERE uuid = $1`, [req.decoded.uuid]);
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

const updateUserByUUID = async (req: Request, res: Response) => {
  try {
    const setClause = [];
    const values = [];

    if (req.body.first_name) {
      setClause.push(`first_name = $${values.length + 1}`);
      values.push(req.body.first_name);
    }

    if (req.body.last_name) {
      setClause.push(`last_name = $${values.length + 1}`);
      values.push(req.body.last_name);
    }

    if (req.body.username) {
      setClause.push(`username = $${values.length + 1}`);
      values.push(req.body.username);
    }

    if (req.body.email) {
      setClause.push(`email = $${values.length + 1}`);
      values.push(req.body.email);
    }

    if (req.body.password) {
      setClause.push(`password = $${values.length + 1}`);
      values.push(req.body.password);
    }

    if (req.body.bio) {
      setClause.push(`bio = $${values.length + 1}`);
      values.push(req.body.bio);
    }

    const updateUser = `UPDATE users SET ${setClause.join(
      ", "
    )} WHERE uuid = $${values.length + 1}`;
    values.push(req.decoded.uuid);

    await pool.query(updateUser, values);

    res.json({ status: "ok", msg: "User updated" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Error updating user" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

export default {
  getAllUsers,
  deleteOneUserByUUID,
  updateUserByUUID,
  getUserByUUID,
};
