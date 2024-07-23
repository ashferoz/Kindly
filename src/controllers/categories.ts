import { Response, Request } from "express";
import pool from "../db/db";
import { addCategoryBody } from "../interfaces/CategoryTypes";

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const getCategories = await pool.query(`SELECT * FROM CATEGORY`);
    res.json(getCategories.rows);
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



export default { getAllCategories };
