import { TicketUpdatedEvent } from "@emir-tickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

describe("Ticket Update Listener test suite", () => {
  const setup = async () => {
    // create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "test",
      price: 20,
    });
    await ticket.save();

    // create a fake data object
    const data: TicketUpdatedEvent["data"] = {
      id: ticket.id,
      version: ticket.version + 1,
      title: "test-updt",
      price: 40,
      userId: "12dfndjfn45bn",
    };

    // create a fake msg object
    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    // return all of this stuff
    return { listener, data, msg, ticket };
  };

  test("finds, updates, and saves ticket", async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.title).toEqual(data.title);
    expect(updatedTicket?.price).toEqual(data.price);
    expect(updatedTicket?.version).toEqual(data.version);
  });

  test("acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  test("don't ack the message if the incoming event is out of order", async () => {
    const { listener, data, msg } = await setup();

    data.version = 10;

    try {
      await listener.onMessage(data, msg);
    } catch (error) {}

    expect(msg.ack).not.toHaveBeenCalled();
  });
});
