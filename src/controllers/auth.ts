import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import pool from "../db/db";

const token = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Error getting token`);
  }
  return value;
};

const register = async (req: Request, res: Response) => {
  try {
    const checkUsername = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [req.body.username]
    );
    if (checkUsername.rows.length > 0) {
      return res
        .status(400)
        .json({ status: "error", msg: "duplicate username" });
    }

    const checkEmail = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [req.body.email]
    );
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ status: "error", msg: "duplicate email" });
    }

    const password = await bcrypt.hash(req.body.password, 12);

    const addUser = `INSERT INTO users (first_name, last_name, username, email, password, bio, role) VALUES ($1, $2, $3, $4, $5, $6, $7)`;

    const values = [
      req.body.first_name,
      req.body.last_name,
      req.body.username,
      req.body.email,
      password,
      req.body.bio,
      req.body.role,
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
  try {
    const findUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [req.body.username]
    );

    if (!findUser.rows.length) {
      return res.status(400).json({ status: "error", msg: "Invalid username" });
    }

    const success = await bcrypt.compare(
      req.body.password,
      findUser.rows[0].password
    );

    if (!success) {
      console.log("username or password error");
      return res.status(401).json({ status: "error", msg: "login failed" });
    }

    const claims = {
      username: findUser.rows[0].username,
      role: findUser.rows[0].role,
      uuid: findUser.rows[0].uuid
    };

    console.log(claims)

    const access = jwt.sign(claims, token("ACCESS_SECRET"), {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    const refresh = jwt.sign(claims, token("REFRESH_SECRET"), {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });

    res.json({ status: "ok", msg: "Login successful", access, refresh });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Login failed" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

interface TokenPayload {
  username: string;
  role: string;
  uuid: string
}

const refresh = async (req: Request, res: Response) => {
  try {
    const decoded = jwt.verify(
      req.body.refresh,
      token("REFRESH_SECRET")
    ) as TokenPayload;
    const claims = { username: decoded.username, role: decoded.role, uuid: decoded.uuid  };

    const access = jwt.sign(claims, token("ACCESS_SECRET"), {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    res.json({ access });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(401).json({ status: "error", msg: "refresh error" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

export default { register, login, refresh };
