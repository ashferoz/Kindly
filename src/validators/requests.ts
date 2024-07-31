import { body, param } from "express-validator";

export const validateAddRequest = [
  body("user_uuid", "user uuid is required").notEmpty(),
  body("title", "title is required").notEmpty(),
  body("title", "title must have length between 1 and 50 characters").isLength({
    min: 1,
    max: 50,
  }),
  body("details", "detail is required").notEmpty(),
  body("category", "category is required").notEmpty(),
  body("urgency", "urgency is required").notEmpty(),
  body("location", "location is required").notEmpty(),
];

export const validateUpdateRequest = [
  param("request_id", "request id is required").notEmpty(),
  body("title", "title is required").optional().notEmpty(),
  body("title", "title must have length between 1 and 50 characters")
    .optional()
    .isLength({
      min: 1,
      max: 50,
    }),
  body("details", "detail is required").optional().notEmpty(),
  body("category", "category is required").optional().notEmpty(),
  body("urgency", "urgency is required").optional().notEmpty(),
  body("location", "location is required").optional().notEmpty(),
];
