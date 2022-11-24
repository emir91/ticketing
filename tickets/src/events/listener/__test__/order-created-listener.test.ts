import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@emir-tickets/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Message } from "node-nats-streaming";

describe("Order Created Listener test suite", () => {
  const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
      title: "test",
      price: 25,
      userId: "12rtyu987cb",
    });

    await ticket.save();

    const data: OrderCreatedEvent["data"] = {
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: "345jhjkl890bn",
      status: OrderStatus.Created,
      expiresAt: "djshdhksdhf",
      version: 0,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    };

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, ticket, data, msg };
  };

  test("sets the userId of the ticket", async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.orderId).toEqual(data.id);
  });

  test("acks the message", async () => {
    const { listener, msg, data } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
