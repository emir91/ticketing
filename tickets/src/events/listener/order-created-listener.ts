import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@emir-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // find the ticket the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket, throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    // save the ticket
    await ticket.save();

    // ack the message
    msg.ack();
  }
}
