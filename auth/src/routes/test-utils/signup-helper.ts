import request from "supertest";
import { app } from "../../app";

export const signupHelper = async () => {
  const response = await request(app).post("/api/users/signup").send({
    email: "test@test.com",
    password: "123456",
  });

  const cookie = response.get("Set-Cookie");

  return cookie;
};
