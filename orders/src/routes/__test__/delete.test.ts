import { OrderStatus } from "@emir-tickets/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { cookieGenerator } from "../test-utils/cookie-generator";

describe("Cancelled order test suite", () => {
  test("cancelled order", async () => {
    const cookie = cookieGenerator();

    // Create a ticket
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "test ticket",
      price: 10,
    });

    await ticket.save();

    // make a request to build an order with this ticket
    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    // make a request to cancel the order
    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", cookie)
      .send()
      .expect(204);

    // fetch order to verify that has been cancelled
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toBe(OrderStatus.Cancelled);
  });

  test("order not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const cookie = cookieGenerator();

    await request(app)
      .delete(`/api/orders/${id}`)
      .set("Cookie", cookie)
      .send()
      .expect(404);
  });

  test("user not authorized", async () => {
    const cookieOne = cookieGenerator();
    const cookieTwo = cookieGenerator();

    // Create a ticket
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "test ticket",
      price: 10,
    });

    await ticket.save();

    // make a request to build an order with this ticket
    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", cookieOne)
      .send({ ticketId: ticket.id })
      .expect(201);

    // send request with other user and got the error
    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", cookieTwo)
      .send()
      .expect(401);
  });

  test("emit order:cancelled event", async () => {
    const cookie = cookieGenerator();

    // Create a ticket
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "test ticket",
      price: 10,
    });

    await ticket.save();

    // make a request to build an order with this ticket
    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    // make a request to cancel the order
    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", cookie)
      .send()
      .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
