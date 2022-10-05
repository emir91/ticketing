import request from "supertest";
import { app } from "../../app";
import { signupHelper } from "../test-utils/signup-helper";

test("respond with details about current user", async () => {
  const cookie = await signupHelper();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send();

  expect(response.body.currentUser).not.toBeNull();
});

test("respond with null when cookie is not set", async () => {
  const response = await request(app).get("/api/users/currentuser").send();

  expect(response.body.currentUser).toBeNull();
});
