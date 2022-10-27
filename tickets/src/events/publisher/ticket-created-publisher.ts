import { Publisher, Subjects, TicketCreatedEvent } from "@emir-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
