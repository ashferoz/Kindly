import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import pool from "../db/db";

const env = (name: string): string => {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Error getting token`);
    }
    return value;
  };


const register = async (req: Request, res: Response) => {
  try {
    const checkUsername = await pool.query(
      "SELECT 1 FROM users WHERE username = $1",
      [req.body.username]
    );
    if (checkUsername.rows.length > 0) {
      return res
        .status(400)
        .json({ status: "error", msg: "duplicate username" });
    }

    const checkEmail = await pool.query(
      "SELECT 1 FROM users WHERE email = $1",
      [req.body.email]
    );
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ status: "error", msg: "duplicate email" });
    }

    const hashed_password = await bcrypt.hash(req.body.hashed_password, 12);

    const addUser = `INSERT INTO users (firstname, lastname, username, email, hashed_password, bio, location_id, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

    const values = [
      req.body.firstname,
      req.body.lastname,
      req.body.username,
      req.body.email,
      hashed_password,
      req.body.bio,
      req.body.location_id,
      req.body.role_id,
    ];

    await pool.query(addUser, values);
    res.json({ status: "ok", msg: "Registration successful" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Invalid registration" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const login = async (req: Request, res: Response) => {
  
};

export default {register, login}