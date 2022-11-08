import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@emir-tickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, id, price } = ticket;
    ticket.set({ id, title, price });
    await ticket.save();

    msg.ack();
  }
}
