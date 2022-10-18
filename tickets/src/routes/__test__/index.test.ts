import request from "supertest";
import { app } from "../../app";
import { cookieGenerator } from "../test-utils/cookie-generator";

const createTicket = async () => {
  const cookie = cookieGenerator();

  const title = "movie";
  const price = 15;

  return request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(201);
};

describe("Ticket index page test suite", () => {
  test("Show all tickets", async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app).get("/api/tickets").send().expect(200);

    expect(response.body.length).toEqual(3);
  });
});
