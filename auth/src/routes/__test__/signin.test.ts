import request from "supertest";
import { app } from "../../app";
import { signupHelper } from "../test-utils/signup-helper";

test("unsuccessful signin - invalid email", async () => {
  const cookie = await signupHelper();

  const response = await request(app)
    .post("/api/users/signin")
    .set("Cookie", cookie)
    .send({
      email: "ksjdnfjdfhj@test.com",
      password: "1234567899890809",
    })
    .expect(400);

  expect(response.body.errors[0].message).toBe("Invalid credentials");
});

test("unsuccessful signin - invalid password", async () => {
  const cookie = await signupHelper();

  const response = await request(app)
    .post("/api/users/signin")
    .set("Cookie", cookie)
    .send({
      email: "test@test.com",
      password: "1234567899890809",
    })
    .expect(400);

  expect(response.body.errors[0].message).toBe("Invalid credentials");
});

test("successful signin", async () => {
  const cookie = await signupHelper();

  const response = await request(app)
    .post("/api/users/signin")
    .set("Cookie", cookie)
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(200);

  expect(response.body.email).toBe("test@test.com");
});
