import request from "supertest";
import { app } from "../../app";

test("signout logic", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);
  await request(app).post("/api/users/signout").send({}).expect(200);

  expect(response.get("Set-Cookie")).toBeDefined;
});
