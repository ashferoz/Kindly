import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface DecodedToken {
  username: string;
  role: string;
  uuid: string;
  iat: number;
  exp: number;
}

interface AuthenticatedRequest extends Request {
  decoded?: DecodedToken;
}

const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers["authorization"];
  
  if (!authorizationHeader) {
    return res.status(400).json({ status: "error", msg: "Token required" });
  }

  const token = authorizationHeader.replace("Bearer ", "");
  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET as string) as DecodedToken;
    req.decoded = decoded;
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(401).json({ status: "error", msg: "Not authorized" });
    } else {
      console.error("An unexpected error occurred:", error);
      return res.status(500).json({ status: "error", msg: "Internal server error" });
    }
  }
};

export default auth;

