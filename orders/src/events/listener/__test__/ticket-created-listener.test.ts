import mongoose from "mongoose";
import { TicketCreatedEvent } from "@emir-tickets/common";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

describe("Ticket Created Listener test suite", () => {
  const setup = async () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create an fake data event
    const data: TicketCreatedEvent["data"] = {
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "test",
      price: 20,
      userId: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, data, msg };
  };

  test("creates and saves a ticket", async () => {
    // call the onMessage function with the data object + message object
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);

    // write assertions to make sure a ticket was created!
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket?.title).toBe(data.title);
    expect(ticket?.price).toBe(data.price);
  });

  test("acks the message", async () => {
    // call the onMessage function with the data object + message object
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);
    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
  });
});
