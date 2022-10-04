import request from "supertest";
import { app } from "../../app";

test("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);
});

test("returns a 400 on invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test",
      password: "123456",
    })
    .expect(400);
});

test("returns a 400 on invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1",
    })
    .expect(400);
});

test("returns a 400 on missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      password: "123456",
    })
    .expect(400);
});
