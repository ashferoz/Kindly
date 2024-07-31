import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const checkErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ status: "error", msg: errors.array() });
  } else {
    next();
  }
};
