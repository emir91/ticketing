import { Router, Request, Response } from "express";
import { requireAuth, validateRequest } from "@emir-tickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = new Ticket({
      title,
      price,
      userId: req.currentUser?.id,
    });

    await ticket.save();

    // create new instance of ticket created publisher
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      // pass the data
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export default router;
