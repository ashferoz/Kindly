import { body } from "express-validator";

export const validateUserUpdateRequest = [
  body("user_uuid", "user uuid is required").notEmpty(),
  body("first_name", "first name is requried").optional().notEmpty().trim(),
  body("first_name", "firstname must have length between 1 and 50 characters")
    .optional()
    .isLength({
      min: 1,
      max: 50,
    }),
  body("last_name", "last name is requried").optional().notEmpty().trim(),
  body("last_name", "firstname must have length between 1 and 50 characters")
    .optional()
    .isLength({
      min: 1,
      max: 50,
    }),
  body("username", "username is requried").optional().notEmpty().trim(),
  body("username", "username must have length between 1 and 20 characters")
    .optional()
    .isLength({
      min: 1,
      max: 20,
    }),
  body("email", "valid email is requried")
    .optional()
    .notEmpty()
    .isEmail()
    .trim(),
];
