import request from "supertest";
import { app } from "../../app";
import { cookieGenerator } from "../test-utils/cookie-generator";
import { Ticket } from "../../models/ticket";

const createTicket = async () => {
  const ticket = new Ticket({
    title: "test ticket",
    price: 10,
  });

  await ticket.save();

  return ticket;
};

describe("Ticket index test suite", () => {
  test("fetches orders for particular user", async () => {
    const ticketOne = await createTicket();
    const ticketTwo = await createTicket();
    const ticketThree = await createTicket();

    const userOne = cookieGenerator();
    const userTwo = cookieGenerator();
    // Create one order as User #1
    await request(app)
      .post("/api/orders")
      .set("Cookie", userOne)
      .send({ ticketId: ticketOne.id })
      .expect(201);

    // Create two orders as User #2
    const { body: orderOne } = await request(app)
      .post("/api/orders")
      .set("Cookie", userTwo)
      .send({ ticketId: ticketTwo.id })
      .expect(201);

    const { body: orderTwo } = await request(app)
      .post("/api/orders")
      .set("Cookie", userTwo)
      .send({ ticketId: ticketThree.id })
      .expect(201);

    // Make request to get orders for User #2
    const response = await request(app)
      .get("/api/orders")
      .set("Cookie", userTwo)
      .expect(200);

    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
  });
});
