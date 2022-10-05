import request from "supertest";
import { app } from "../../app";

test("unsuccessful signin - invalid email", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "ksjdnfjdfhj",
      password: "123456",
    })
    .expect(400);
});

test("unsuccessful signin - invalid password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "1234567899890809",
    })
    .expect(400);
});

test("successful signin", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
