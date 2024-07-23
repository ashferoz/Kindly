import { Request, Response } from "express";
import pool from "../db/db";

const getAllLocations = async (req: Request, res: Response) => {
  try {
    const getLocations = await pool.query(`SELECT * FROM  LOCATIONS`);
    res.json(getLocations.rows);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res
        .status(400)
        .json({ status: "error", msg: "error getting all categories" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};


export default {getAllLocations}