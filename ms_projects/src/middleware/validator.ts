import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";

export const validateFields = (validations: ValidationChain[],errorMessages:String) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation:ValidationChain) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ messages:errorMessages,errors: errors.array() });
    }

    next();
  };
};
