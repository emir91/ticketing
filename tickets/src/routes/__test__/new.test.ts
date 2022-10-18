import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { cookieGenerator } from "../test-utils/cookie-generator";

describe("New ticket test suite", () => {
  test("has a route handler listening to /api/tickets for post req", async () => {
    const response = await request(app).post("/api/tickets").send({});
    expect(response.statusCode).not.toEqual(404);
  });

  test("can only be accessed if the user is signed in", async () => {
    await request(app).post("/api/tickets").send({}).expect(401);
  });

  test("returns a status other than 401 if the user is signed in", async () => {
    const cookie = cookieGenerator();

    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({});

    expect(response.status).not.toEqual(401);
  });

  test("returns an error if an invalid title is provided", async () => {
    const cookie = cookieGenerator();

    await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        price: 10,
      })
      .expect(400);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "",
        price: 10,
      })
      .expect(400);
  });

  test("returns an error if an invalid price is provided", async () => {
    const cookie = cookieGenerator();

    await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "",
        price: -10,
      })
      .expect(400);
  });

  test("creates a ticket with valid inputs", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toBe(0);

    const cookie = cookieGenerator();

    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "test",
        price: 10,
      })
      .expect(201);

    tickets = await Ticket.find({});

    expect(tickets.length).toBe(1);
  });
});
