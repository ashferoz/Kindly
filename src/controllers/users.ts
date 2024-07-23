import { Response, Request } from "express";
import pool from "../db/db";
import { DelRequestBody, AddNewUserBody } from "../interfaces/UsersTypes";

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

const addNewUser = async (
  req: Request<{}, {}, AddNewUserBody>,
  res: Response
) => {
  try {
    const addUser = `INSERT INTO users (firstname, lastname, username, email, hashed_password, bio, location_id, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

    const values = [
      req.body.firstname,
      req.body.lastname,
      req.body.username,
      req.body.email,
      req.body.hashed_password,
      req.body.bio,
      req.body.location_id,
      req.body.role_id,
    ];

    await pool.query(addUser, values);
    res.json({ status: "ok", msg: "User added" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

export default { getAllUsers, deleteOneUserByUUID, addNewUser };
