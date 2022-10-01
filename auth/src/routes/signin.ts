import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Provide valid email"),
    body("password").trim().isEmpty().withMessage("Provide valid password"),
  ],
  validateRequest,
  (req: Request, res: Response) => {}
);

export default router;
