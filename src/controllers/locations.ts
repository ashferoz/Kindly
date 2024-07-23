import { Request, Response } from "express";
import pool from "../db/db";
import {
  DelLocationParams,
  AddLocationBody,
} from "../interfaces/LocationTypes";

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

const deleteLocationsById = async (
  req: Request<DelLocationParams, {}, {}>,
  res: Response
) => {
  try {
    await pool.query(`DELETE FROM LOCATIONS where id = $1`, [req.params.id]);
    res.json({ status: "ok", msg: "Location deleted" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Error deleting location" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const addNewLocation = async (
  req: Request<{}, {}, AddLocationBody>,
  res: Response
) => {
  try {
    const addLocation = `INSERT INTO LOCATIONS VALUES($1, $2)`;
    const values = [req.body.id, req.body.description];

    await pool.query(addLocation, values);
    res.json({ status: "ok", msg: "Location added" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).json({ status: "error", msg: "Error adding location" });
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

export default { getAllLocations, deleteLocationsById, addNewLocation };
