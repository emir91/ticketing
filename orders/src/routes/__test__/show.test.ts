import { body } from "express-validator";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { cookieGenerator } from "../test-utils/cookie-generator";

describe("Single order fetch test suite", () => {
  test("fetch the order", async () => {
    const cookie = cookieGenerator();

    // Create a ticket
    const ticket = new Ticket({
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

    // make request to fetch the order
    const { body: fetchedOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", cookie)
      .send()
      .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
  });

  test("order not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const cookie = cookieGenerator();

    await request(app)
      .get(`/api/orders/${id}`)
      .set("Cookie", cookie)
      .send()
      .expect(404);
  });

  test("user not authorized", async () => {
    const cookieOne = cookieGenerator();
    const cookieTwo = cookieGenerator();

    // Create a ticket
    const ticket = new Ticket({
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

    // make request to fetch the order
    await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", cookieTwo)
      .send()
      .expect(401);
  });
});
