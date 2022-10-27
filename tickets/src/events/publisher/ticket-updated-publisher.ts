import { Subjects, Publisher, TicketUpdatedEvent } from "@emir-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
