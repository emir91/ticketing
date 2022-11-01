import { Router, Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@emir-tickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

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
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    const existingOrder = await Order.findOne({
      ticket: ticket,
      status: {
        $in: [
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
          OrderStatus.Created,
        ],
      },
    });

    if (existingOrder) {
      throw new BadRequestError("Ticket is already reserved");
    }
    res.send({});
  }
);

export default router;
