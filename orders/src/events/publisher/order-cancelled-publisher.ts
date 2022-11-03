import { Subjects, OrderCancelledEvent, Publisher } from "@emir-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
