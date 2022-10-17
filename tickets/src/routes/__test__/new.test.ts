import request from "supertest";
import { app } from "../../app";
import { cookieGenerator } from "../test-utils/cookie-generator";

it("has a route handler listening to /api/tickets for post req", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.statusCode).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const cookie = cookieGenerator();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  const cookie = cookieGenerator();

  await request(app).post("/api/tickets").set("Cookie", cookie).send({
    price: 10,
  });

  await request(app).post("/api/tickets").set("Cookie", cookie).send({
    title: "",
    price: 10,
  });
});

it("returns an error if an invalid price is provided", async () => {
  const cookie = cookieGenerator();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: -10,
    });
});

it("creates a ticket with valid inputs", async () => {});
