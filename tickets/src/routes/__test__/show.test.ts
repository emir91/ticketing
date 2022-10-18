import request from "supertest";
import { app } from "../../app";
import { cookieGenerator } from "../test-utils/cookie-generator";

describe("Show ticket route test suite", () => {
  test("Ticket not found", async () => {
    await request(app).get("/api/tickets/dlkffhdlkgh").send().expect(404);
  });

  test("Ticket found", async () => {
    const cookie = cookieGenerator();

    const title = "movie";
    const price = 15;

    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(201);

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send()
      .expect(200);

    expect(ticketResponse.body.title).toBe(title);
    expect(ticketResponse.body.price).toBe(price);
  });
});
