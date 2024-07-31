import { body } from "express-validator";

export const validateRegistrationData = [
  body("email", "valid email is requried").notEmpty().isEmail().trim(),
  body("password", "password is requried").notEmpty(),
  body("first_name", "first name is requried").notEmpty().trim(),
  body(
    "first_name",
    "firstname must have length between 1 and 50 characters"
  ).isLength({
    min: 1,
    max: 50,
  }),
  body("last_name", "last name is requried").notEmpty().trim(),
  body(
    "last_name",
    "firstname must have length between 1 and 50 characters"
  ).isLength({
    min: 1,
    max: 50,
  }),
  body("username", "username is requried").notEmpty().trim(),
  body(
    "username",
    "username must have length between 1 and 20 characters"
  ).isLength({
    min: 1,
    max: 20,
  }),
  body("role", "role is requried").notEmpty(),
  body(
    "password",
    "password length min is 8 and max is 50 characters"
  ).isLength({ min: 8, max: 50 }),
];

export const validateLoginData = [
  body("username", "valid username is requried").notEmpty(),
  body("password", "password is requried").notEmpty(),
];

export const validateRefreshToken = [
  body("refresh", "valid refresh token is required").notEmpty().isJWT(),
];
