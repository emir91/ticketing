import { Subjects, OrderCreatedEvent, Publisher } from "@emir-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
