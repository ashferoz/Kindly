import { Response, Request } from "express";
import pool from "../db/db";
import {
  DelRequestBody,
  AddNewUserBody,
  UpdateUserBody,
} from "../interfaces/UsersTypes";

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
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Error adding user" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const updateUserByUUID = async (
  req: Request<{}, {}, UpdateUserBody>,
  res: Response
) => {
  try {
    const setClause = [];
    const values = [];

    if (req.body.firstname) {
      setClause.push(`firstname = $${values.length + 1}`);
      values.push(req.body.firstname);
    }

    if (req.body.lastname) {
      setClause.push(`lastname = $${values.length + 1}`);
      values.push(req.body.lastname);
    }

    if (req.body.username) {
      setClause.push(`username = $${values.length + 1}`);
      values.push(req.body.username);
    }

    if (req.body.email) {
      setClause.push(`email = $${values.length + 1}`);
      values.push(req.body.email);
    }

    if (req.body.hashed_password) {
      setClause.push(`hashed_password = $${values.length + 1}`);
      values.push(req.body.hashed_password);
    }

    if (req.body.bio) {
      setClause.push(`bio = $${values.length + 1}`);
      values.push(req.body.bio);
    }

    if (req.body.location_id) {
      setClause.push(`location_id = $${values.length + 1}`);
      values.push(req.body.location_id);
    }

    const updateUser = `UPDATE users SET ${setClause.join(
      ", "
    )} WHERE uuid = $${values.length + 1}`;
    values.push(req.body.uuid);

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

export default { getAllUsers, deleteOneUserByUUID, addNewUser, updateUserByUUID };
