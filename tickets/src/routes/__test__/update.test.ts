import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { cookieGenerator } from "../test-utils/cookie-generator";
import { natsWrapper } from "../../nats-wrapper";

describe("Update ticket test suite", () => {
  test("returns a 404 if the provided id does not exist", async () => {
    const cookie = cookieGenerator();
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/api/tickets/${id}`)
      .set("Cookie", cookie)
      .send({
        title: "updated title",
        price: 10,
      })
      .expect(404);
  });

  test("returns a 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/api/tickets/${id}`)
      .send({
        title: "updated title",
        price: 10,
      })
      .expect(401);
  });

  test("returns a 401 if the user does not own the ticket", async () => {
    const response = await request(app)
      .post(`/api/tickets`)
      .set("Cookie", cookieGenerator())
      .send({
        title: "title",
        price: 10,
      })
      .expect(201);

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookieGenerator())
      .send({
        title: "updated title",
        price: 10,
      })
      .expect(401);
  });

  test("returns a 400 if the user provides an invalid title or price", async () => {
    const cookie = cookieGenerator();

    const response = await request(app)
      .post(`/api/tickets`)
      .set("Cookie", cookieGenerator())
      .send({
        title: "title",
        price: 10,
      })
      .expect(201);

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookieGenerator())
      .send({
        title: "",
        price: 10,
      })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookieGenerator())
      .send({
        title: "updated title",
        price: -10,
      })
      .expect(400);
  });

  test("ticket updated, a valid input provided", async () => {
    const cookie = cookieGenerator();

    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "title",
        price: 10,
      })
      .expect(201);

    const updateTicket = await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        title: "updated title",
        price: 12,
      })
      .expect(200);

    expect(updateTicket.body.title).toEqual("updated title");
    expect(updateTicket.body.price).toEqual(12);
  });

  test("event published", async () => {
    const cookie = cookieGenerator();

    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "title",
        price: 10,
      })
      .expect(201);

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        title: "updated title",
        price: 12,
      })
      .expect(200);

    expect(natsWrapper.client.publish).toBeCalled();
  });
});
