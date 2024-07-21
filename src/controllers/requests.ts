import { Response, Request, NextFunction } from "express";
import connectDB from "../db/db";

const getAllRequests = async function findAll(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const client = connectDB;
  try {
    const result = await client.query("SELECT * FROM requests");
    const requests = result.rows;

    res.json(requests);
  } catch (error) {
    next(error);
  }
};



export default {
  getAllRequests
};