import { body } from "express-validator";

export const validationName = () =>
  body("name").trim().notEmpty().isLength({ min: 3, max: 10 });

export const validationAbbreviation = () =>
  body("abbreviation").trim().escape().isLength({ max: 3 });

export const validationDescription = () =>
  body("description").trim().escape();
