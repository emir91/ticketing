import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { cookieGenerator } from "../test-utils/cookie-generator";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

describe("New Order Test Suite", () => {
  test("returns an error if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId();
    const cookie = cookieGenerator();

    await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId })
      .expect(404);
  });

  test("returns an error if the ticket is already reserved", async () => {
    const cookie = cookieGenerator();
    const ticket = Ticket.build({
      title: "test ticket",
      price: 10,
    });

    await ticket.save();

    const order = new Order({
      ticket,
      userId: "1w33kljkjkj5",
      status: OrderStatus.Created,
      expiresAt: new Date(),
    });

    await order.save();

    await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(400);
  });

  test("reserves a ticket", async () => {
    const cookie = cookieGenerator();
    const ticket = Ticket.build({
      title: "test ticket",
      price: 10,
    });

    await ticket.save();

    await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    const order = await Order.find({});

    expect(order.length).not.toBe(0);
  });
});
