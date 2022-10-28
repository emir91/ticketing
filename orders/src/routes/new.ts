import { Router, Request, Response } from "express";
import { requireAuth, validateRequest } from "@emir-tickets/common";
import { body } from "express-validator";

const router = Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .isMongoId()
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export default router;
