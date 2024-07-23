require("dotenv").config();

import express, { Response, Request } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import requests from "./src/routers/requests";
import users from "./src/routers/users";
import categories from "./src/routers/categories"

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello this is Ash. I am learning typescript!! Wish me luck");
});

app.use("/api", requests);
app.use("/users", users);
app.use("/category", categories)

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
