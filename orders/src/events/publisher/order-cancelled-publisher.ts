import { Subjects, OrderCancelledEvent, Publisher } from "@emir-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
