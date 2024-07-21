import { Response, Request } from "express";
import connectDB from "../db/db";

const getAllRequests = async (req: Request, res: Response) => {
  try {
    const allResults = await connectDB.query("SELECT * FROM requests");
    res.json(allResults.rows);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res
        .status(400)
        .json({ status: "error", msg: "error getting all requests" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

export default {
  getAllRequests,
};
