import { body } from "express-validator";

export const isNameReceived = () =>
  body("name").trim().notEmpty().escape();
;

export const isStartDateReceived = () =>
  body("startDate").trim().notEmpty().withMessage("Start date is required.");
;
export const isCodeReceived = () =>
  body("code").trim().notEmpty().escape().isLength({ min: 5, max: 5 }).withMessage("Code is required.");
;

